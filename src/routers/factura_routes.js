import {Router} from 'express'
const router = Router()
import { generateInvoiceXml } from '../controllers/factura_controller.js';
import { generatePdf } from '../controllers/facturaPDF_controller.js';


router.post('/factura/generate-invoice', generateInvoiceXml)
router.get('/factura/generate-pdf/:id', generatePdf)


export default router