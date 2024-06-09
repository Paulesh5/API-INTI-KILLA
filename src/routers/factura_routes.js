import {Router} from 'express'
const router = Router()
import { detalleFactura, generateInvoiceXml, listarFacturas } from '../controllers/factura_controller.js';
import { generatePdf } from '../controllers/facturaPDF_controller.js';
import verificarAutenticacion from "../middlewares/autenticacion.js";


router.get('/facturas', verificarAutenticacion, listarFacturas)
router.get('/factura/:id', verificarAutenticacion, detalleFactura)
router.post('/factura/generate-invoice', verificarAutenticacion, generateInvoiceXml)
router.get('/factura/generate-pdf/:id', verificarAutenticacion, generatePdf)


export default router