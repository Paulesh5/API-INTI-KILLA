import {Router} from 'express'
const router = Router()
import {
    perfilCliente,
    listarClientes,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente,
    busquedaCliente
} from "../controllers/cliente_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";


router.get('/cliente/informacion', verificarAutenticacion, perfilCliente)
router.get('/clientes', verificarAutenticacion, listarClientes)
router.get('/cliente/:id', verificarAutenticacion, detalleCliente)
router.post('/cliente/:cedula', verificarAutenticacion, busquedaCliente)
router.post('/cliente/registro', verificarAutenticacion, registrarCliente)
router.put('/cliente/actualizar/:id', verificarAutenticacion, actualizarCliente)
router.delete('/cliente/eliminar/:id', verificarAutenticacion, eliminarCliente)

export default router