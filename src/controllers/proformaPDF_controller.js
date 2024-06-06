import PdfkitConstruct from 'pdfkit-construct';
import path from 'path';
import fs from 'fs';
import Proforma from '../models/Proforma.js';
import Cliente from '../models/Cliente.js';

export const generatePdf = async (req, res) => {
  const { id } = req.params;

  try {
    const proforma = await Proforma.findById(id);
    if (!proforma) {
      return res.status(404).json({ msg: "Proforma no encontrada" });
    }

    // Obtener los datos del cliente desde la base de datos
    const cliente = await Cliente.findById(proforma.id_cliente);
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    const __dirname = path.resolve();

    // Ruta del logo de la empresa
    const logoPath = path.join(__dirname, 'src', 'public', 'INTI-KILLA-LOGO.png');

    // Crear un nuevo documento PDF
    const doc = new PdfkitConstruct({
      size: 'A4',
      margins: {top: 50, left: 50, right: 50, bottom: 50},
      bufferPages: true, // Habilitar buffer de páginas para encabezado y pie de página en todas las páginas
    });

    // Establecer el encabezado para renderizar en cada página
    doc.setDocumentHeader({ height: "10%" }, () => {
      // Rectángulo para el encabezado con color de fondo
      doc.lineJoin('miter')
        .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");

      // Agregar el nombre de la empresa en el encabezado
      doc.fill("#115dc8")
        .fontSize(24)
        .text("INTI KILLA", { bold: true, align: 'center' });
    });

    // Establecer el pie de página para renderizar en cada página
    doc.setDocumentFooter({ height: "10%" }, () => {
      // Rectángulo para el pie de página con color de fondo
      doc.lineJoin('miter')
        .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#c2edbe");

      // Agregar la información de la empresa en el pie de página
      doc.fill("#000")
        .fontSize(10)
        .text("RUC: 1708978539001", 50, doc.footer.y + 10)
        .text("mail: intikilla@gmail.com", 50, doc.footer.y + 25)
        .text("direccion: RICARDO IZURIETA E20-353 Y E20F", 50, doc.footer.y + 40);
    });

    // Agregar el logo de la empresa en la esquina superior izquierda
    doc.image(logoPath, 50, 50, { width: 100 });

    // DATOS DEL CLIENTE
    doc.fontSize(14)
      .text("DATOS DEL CLIENTE", { bold: true })
      .moveDown(0.5)
      .text(`Nombre: ${cliente.nombre}`)
      .text(`Cédula: ${cliente.cedula}`)
      .text(`Teléfono: ${cliente.telefono}`)
      .text(`Dirección: ${cliente.direccion}`)
      .text(`Email: ${cliente.email}`)
      .moveDown(1);

    // PROFORMA NUMERO
    doc.fontSize(14)
      .text("PROFORMA NUMERO", { bold: true })
      .moveDown(0.5)
      .text(`Secuencial: ${proforma.secuencial}`)
      .text(`Fecha: ${new Date(proforma.fechaEmision).toLocaleDateString()}`)
      .moveDown(1);

    // Agregar una tabla para los productos
    doc.addTable(
      [
        {key: 'codigo', label: 'CODIGO', align: 'left'},
        {key: 'nombre', label: 'CONCEPTO', align: 'left'},
        {key: 'cantidad', label: 'CANTIDAD', align: 'left'},
        {key: 'precioUnitario', label: 'PRECIO UNITARIO', align: 'right'},
        {key: 'total', label: 'TOTAL', align: 'right'}
      ],
      proforma.productos.map(producto => ({
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario.toFixed(2),
        total: (producto.precioUnitario * producto.cantidad).toFixed(2)
      })),
      {
        marginLeft: 100,
        marginRight: 100,
        headAlign: 'center',
        width: 'auto', // Cambiar el ancho de la tabla a automático
      }
    );

    // Renderizar tablas
    doc.render();

    // Guardar el PDF en el servidor
    const filePath = path.join(__dirname, '..', 'proformas', `proforma_${proforma.secuencial}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));
    doc.end();

    // Enviar el PDF como descarga
    res.download(filePath, `proforma_${proforma.secuencial}.pdf`);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
