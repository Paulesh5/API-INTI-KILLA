import xmlbuilder from 'xmlbuilder';
import fs from 'fs';
import path from 'path';
import Cliente from "../models/Cliente.js";
import Factura from "../models/Factura.js";

// Función para generar la clave de acceso
const generateAccessKey = (fecha, tipoComprobante, rucEmpresa, produccionPrueba, estab, ptoEmi, secuencial, idcod, tipoEmision) => {
  let suma = 0, factor = 2;
  const claveAcceso = `${fecha}${tipoComprobante}${rucEmpresa}${produccionPrueba}${estab}${ptoEmi}${secuencial}${idcod}${tipoEmision}`;
  for (let i = claveAcceso.length - 1; i >= 0; i--) {
    suma += parseInt(claveAcceso[i], 10) * factor;
    factor = (factor === 7) ? 2 : factor + 1;
  }
  let digitoVerificador = 11 - (suma % 11);
  if (digitoVerificador === 11) digitoVerificador = 0;
  if (digitoVerificador === 10) digitoVerificador = 1;
  return claveAcceso + digitoVerificador;
};

export const generateInvoiceXml = async (req, res) => {
  const ambiente = 1; // 1 para pruebas, 2 para produccion
  const iva = 15;
  const codIva = 4;
  const tipoEmision = 1;
  const ruc = '1708978539001';
  const estab = '001';
  const ptoEmi = '001';
  const tipoComprobante = '01';

  const {
    id_cliente,
    id_empleado,
    products,
    totalSinImpuestos,
    totalDescuento,
    totalImpuestoValor,
    importeTotal,
    pagoTotal,
    formaPago
  } = req.body;

  if (Object.values(req.body).some(value => value === "" || value === null || value === undefined) || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  try {
    // Obtener datos del cliente desde la base de datos
    const clienteBDD = await Cliente.findById(id_cliente);

    if (!clienteBDD) return res.status(400).json({ msg: "Lo sentimos, el cliente no se encuentra registrado" });

    // Desestructurar los datos del cliente
    const { nombre, cedula, telefono, direccion, email, tipodoc } = clienteBDD;

    // Obtener el último secuencial de factura
    const lastInvoice = await Factura.findOne().sort({ _id: -1 }).limit(1);
    let secuencial = lastInvoice ? parseInt(lastInvoice.secuencial) + 1 : 1;
    secuencial = secuencial.toString().padStart(9, '0'); // Asegurar que tenga 9 dígitos

    // Obtener la fecha actual en el formato requerido "ddmmaaaa"
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaActual.getFullYear().toString();
    const fechaEmision = `${dia}${mes}${año}`; // Formato "ddmmaaaa"

    // Generate Clave de Acceso
    const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const claveAcceso = generateAccessKey(fechaEmision, tipoComprobante, ruc, ambiente.toString(), estab, ptoEmi, secuencial, randomCode, tipoEmision.toString());

    // Asegurar que los valores monetarios tengan dos decimales
    const totalSinImpuestosFixed = parseFloat(totalSinImpuestos).toFixed(2);
    const totalDescuentoFixed = parseFloat(totalDescuento).toFixed(2);
    const totalImpuestoValorFixed = parseFloat(totalImpuestoValor).toFixed(2);
    const importeTotalFixed = parseFloat(importeTotal).toFixed(2);
    const pagoTotalFixed = parseFloat(pagoTotal).toFixed(2);

    // Create XML document
    const xml = xmlbuilder.create('factura')
      .att('id', 'comprobante')
      .att('version', '1.1.0');

    xml.ele('infoTributaria')
      .ele('ambiente', ambiente).up()
      .ele('tipoEmision', tipoEmision).up()
      .ele('razonSocial', 'PANCHI MELO IVAN VINICIO').up()
      .ele('nombreComercial', 'INTI KILLA').up()
      .ele('ruc', ruc).up()
      .ele('claveAcceso', claveAcceso).up()
      .ele('codDoc', tipoComprobante).up()
      .ele('estab', estab).up()
      .ele('ptoEmi', ptoEmi).up()
      .ele('secuencial', secuencial).up()
      .ele('dirMatriz', 'RICARDO IZURIETA E20-353 Y E20F').up()
      .up();

    xml.ele('infoFactura')
      .ele('fechaEmision', `${dia}/${mes}/${año}`).up()
      .ele('dirEstablecimiento', 'RICARDO IZURIETA E20-353 Y E20F').up()
      //.ele('contribuyenteEspecial', '5368').up()
      .ele('obligadoContabilidad', 'NO').up()
      .ele('tipoIdentificacionComprador', tipodoc).up()
      .ele('razonSocialComprador', nombre.toUpperCase()).up()
      .ele('identificacionComprador', cedula).up()
      .ele('direccionComprador', direccion.toUpperCase()).up()
      .ele('totalSinImpuestos', totalSinImpuestosFixed).up()
      .ele('totalDescuento', totalDescuentoFixed).up()
      .ele('totalConImpuestos')
        .ele('totalImpuesto')
          .ele('codigo', 2).up()
          .ele('codigoPorcentaje', 0).up()
          .ele('baseImponible', '0.00').up()
          .ele('tarifa', 0).up()
          .ele('valor', '0.00').up()
        .up()
        .ele('totalImpuesto')
          .ele('codigo', 2).up()
          .ele('codigoPorcentaje', codIva).up()
          .ele('baseImponible', totalSinImpuestosFixed).up()
          .ele('tarifa', iva).up()
          .ele('valor', totalImpuestoValorFixed).up()
        .up()
      .up()
      .ele('propina', '0.00').up()
      .ele('importeTotal', importeTotalFixed).up()
      .ele('moneda', 'DOLAR').up()
      .ele('pagos')
        .ele('pago')
          .ele('formaPago', formaPago).up()
          .ele('total', pagoTotalFixed).up()
          .ele('plazo', 0).up()
          .ele('unidadTiempo', 'MESES').up()
        .up()
      .up();

    const detalles = xml.ele('detalles');
    products.forEach(product => {
      const precioTotalSinImpuesto = parseFloat(product.precioUnitario * product.cantidad).toFixed(2);
      const impuestoValor = parseFloat(precioTotalSinImpuesto * (iva / 100)).toFixed(2);
      const detalle = detalles.ele('detalle')
        .ele('codigoPrincipal', product.codigo).up()
        .ele('descripcion', product.nombre).up()
        .ele('cantidad', product.cantidad).up()
        .ele('precioUnitario', parseFloat(product.precioUnitario).toFixed(2)).up()
        .ele('descuento', '0.00').up()
        .ele('precioTotalSinImpuesto', precioTotalSinImpuesto).up()
        .ele('impuestos')
          .ele('impuesto')
            .ele('codigo', 2).up()
            .ele('codigoPorcentaje', codIva).up()
            .ele('tarifa', iva).up()
            .ele('baseImponible', precioTotalSinImpuesto).up()
            .ele('valor', impuestoValor).up()
          .up()
        .up();
    });

    xml.ele('infoAdicional')
      //.ele('campoAdicional', { nombre: 'DIRECCION' }, direccion).up()
      .ele('campoAdicional', { nombre: 'DESCUENTO' }, '0.00').up()
      .ele('campoAdicional', { nombre: 'EMAIL' }, email).up()
      .ele('campoAdicional', { nombre: 'TELEFONO' }, telefono).up();

    // Convertir XML a string
    const xmlString = xml.end({ pretty: true });

    // Definir la ruta del archivo
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, '..', 'invoices', `invoice_${secuencial}.xml`);

    // Asegurar que el directorio de facturas exista
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir el XML en un archivo
    fs.writeFile(filePath, xmlString, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar el archivo' });
      }

      // Crear un nuevo objeto de la factura
      const nuevaFactura = new Factura({
        id_cliente,
        id_empleado, // Suponiendo que tienes un middleware para autenticar al usuario y guardar su ID en req.user
        secuencial, // Guardar solo el secuencial
        fechaEmision: fechaActual,
        claveAcceso,
        productos: products,
        totalSinImpuestos: totalSinImpuestosFixed,
        totalDescuento: totalDescuentoFixed,
        totalImpuestoValor: totalImpuestoValorFixed,
        importeTotal: importeTotalFixed,
        pagoTotal: pagoTotalFixed,
        formaPago
      });

      // Guardar la factura en la base de datos
      await nuevaFactura.save();

      res.status(200).json({ message: 'Invoice XML generado y guardado', filePath });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
