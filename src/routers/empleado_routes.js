import {Router} from 'express'
const router = Router()
import {
    perfilEmpleado,
    listarEmpleados,
    detalleEmpleado,
    registrarEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
} from "../controllers/empleado_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";


router.get('/empleado/informacion', verificarAutenticacion, perfilEmpleado)
router.get('/empleados', verificarAutenticacion, listarEmpleados)
router.get('/empleado/:id', verificarAutenticacion, detalleEmpleado)
router.post('/empleado/registro', verificarAutenticacion, registrarEmpleado)
router.put('/empleado/actualizar/:id', verificarAutenticacion, actualizarEmpleado)
router.delete('/empleado/eliminar/:id', verificarAutenticacion, eliminarEmpleado)

export default router