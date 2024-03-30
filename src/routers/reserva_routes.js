import {Router} from 'express'
const router = Router()
import {
    infoReserva,
    listarReservas,
    detalleReserva,
    registrarReserva,
    actualizarReserva,
    eliminarReserva
} from "../controllers/reserva_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";


router.get('/reserva/informacion', verificarAutenticacion, infoReserva)
router.get('/reservas', verificarAutenticacion, listarReservas)
router.get('/reserva/:id', verificarAutenticacion, detalleReserva)
router.post('/reserva/registro', verificarAutenticacion, registrarReserva)
router.put('/reserva/actualizar/:id', verificarAutenticacion, actualizarReserva)
router.delete('/reserva/eliminar/:id', verificarAutenticacion, eliminarReserva)

export default router