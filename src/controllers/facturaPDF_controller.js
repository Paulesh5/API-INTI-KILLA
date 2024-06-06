import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import Factura from '../models/Factura.js';
import Cliente from '../models/Cliente.js';

export const generatePdf = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los datos de la factura desde la base de datos
    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }

    // Obtener los datos del cliente desde la base de datos
    const cliente = await Cliente.findById(factura.id_cliente);
    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, '..', 'invoices', `invoice_${factura.secuencial}.pdf`);

    // Asegurar que el directorio de facturas exista
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Pipe el documento PDF a un archivo
    doc.pipe(fs.createWriteStream(filePath));

    // Agregar contenido al documento PDF
    doc.fontSize(20).text('Factura', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Clave de Acceso: ${factura.claveAcceso}`);
    doc.text(`Secuencial: ${factura.secuencial}`);
    doc.text(`Fecha de Emisión: ${new Date(factura.fechaEmision).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text('Datos del Cliente');
    doc.fontSize(12).text(`Nombre: ${cliente.nombre}`);
    doc.text(`Cédula: ${cliente.cedula}`);
    doc.text(`Teléfono: ${cliente.telefono}`);
    doc.text(`Dirección: ${cliente.direccion}`);
    doc.text(`Email: ${cliente.email}`);
    doc.moveDown();

    doc.fontSize(16).text('Detalle de Productos');
    factura.productos.forEach(producto => {
      doc.fontSize(12).text(`Producto: ${producto.nombre}`);
      doc.text(`Código: ${producto.codigo}`);
      doc.text(`Cantidad: ${producto.cantidad}`);
      doc.text(`Precio Unitario: ${producto.precioUnitario}`);
      doc.text(`Total: ${(producto.precioUnitario * producto.cantidad).toFixed(2)}`);
      doc.moveDown();
    });

    doc.fontSize(16).text('Resumen de la Factura');
    doc.fontSize(12).text(`Total sin Impuestos: ${factura.totalSinImpuestos}`);
    doc.text(`Descuento: ${factura.totalDescuento}`);
    doc.text(`Total Impuesto Valor: ${factura.totalImpuestoValor}`);
    doc.text(`Importe Total: ${factura.importeTotal}`);
    doc.text(`Pago Total: ${factura.pagoTotal}`);
    doc.text(`Forma de Pago: ${factura.formaPago}`);
    doc.moveDown();

    // Finalizar el documento PDF
    doc.end();

    // Esperar a que el archivo se haya escrito
    doc.on('finish', () => {
      res.download(filePath, `invoice_${factura.secuencial}.pdf`, (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).json({ message: 'Error al descargar el archivo' });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
