import {Router} from 'express'
const router = Router()
import {
    loginEmpleado,
	perfilEmpleado,
    listarEmpleados,
    detalleEmpleado,
    registrarEmpleado,
    confirmEmailEmpleado,
    actualizarPasswordEmpleado,
    recuperarPasswordEmpleado,
    nuevoPasswordEmpleado,
    recuperarUsernameEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
} from "../controllers/empleado_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

router.post("/empleado/login", loginEmpleado)

router.get("/empleado/confirmar/:token", confirmEmailEmpleado);

router.get("/empleado/recuperar-password", recuperarPasswordEmpleado);

router.get("/empleado/recuperar-username", recuperarUsernameEmpleado);

router.post("/empleado/nuevo-password", nuevoPasswordEmpleado);

router.post('/empleado/registro', verificarAutenticacion, registrarEmpleado)

router.get('/empleado/informacion', verificarAutenticacion, perfilEmpleado)

router.put('/usuario/actualizarpassword', verificarAutenticacion, actualizarPasswordEmpleado)

router.get('/empleados', verificarAutenticacion, listarEmpleados)

router.get('/empleado/:id', verificarAutenticacion, detalleEmpleado)

router.put('/empleado/actualizar/:id', verificarAutenticacion, actualizarEmpleado)

router.delete('/empleado/eliminar/:id', verificarAutenticacion, eliminarEmpleado)

export default router