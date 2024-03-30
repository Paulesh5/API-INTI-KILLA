import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";

const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email}).select("-__v -token -updatedAt -createdAt")
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await usuarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(usuarioBDD._id,"usuario")
    const {nombre,apellido,_id} = usuarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        email:usuarioBDD.email
    })
}

const perfil =(req,res)=>{
    delete req.usuarioBDD.token
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

const registro =async (req,res)=>{
    // Desestructura los campos
    const {email,password} = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario de la BDD en base al email
    const verificarEmailBDD = await Usuario.findOne({email})
    // Validar que el email sea nuevo
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crear una instancia del Usuario
    const nuevoUsuario = new Usuario(req.body)
    // Encriptar el password
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    // Guardar en base de datos
    await nuevoUsuario.save()
    // Responder
    res.status(200).json({msg:"Usuario registrado"})
}

const detalleUsuario = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const usuarioBDD = await Usuario.findById(id).select("-password")
    if(!usuarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Usuario ${id}`})
    res.status(200).json({msg:usuarioBDD})
}

export{
    login,
    perfil,
    registro,
    detalleUsuario
}