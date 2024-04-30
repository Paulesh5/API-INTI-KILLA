import {Router} from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import { validacionUsuario } from '../middlewares/validacionUsuario.js';

const router = Router()
import{
    login,
    perfil,
    registro,
    confirmEmail,
    detalleUsuario,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    actualizarPerfil
} from "../controllers/usuario_controller.js";

router.post("/login", login)

router.post("/registro", registro)

router.get("/confirmar/:token", confirmEmail);

router.get("/recuperar-password", recuperarPassword);

router.get("/recuperar-password/:token", comprobarTokenPasword);

router.post("/nuevo-password/:token", nuevoPassword);

router.get("/perfil", verificarAutenticacion, perfil)

router.put('/usuario/actualizarpassword', verificarAutenticacion, actualizarPassword)

router.get('/usuario/:id', verificarAutenticacion, detalleUsuario)

router.put("/usuario/:id", verificarAutenticacion, actualizarPerfil);

export default router