import Empleado from "../models/Empleado.js"
import mongoose from "mongoose"

const perfilEmpleado =(req,res)=>{
    delete req.empleadoBDD.createdAt
    delete req.empleadoBDD.updatedAt
    delete req.empleadoBDD.__v
    res.status(200).json(req.empleadoBDD)
}
const listarEmpleados = async (req,res)=>{
    const empleados = await Empleado.find({estado:true}).where('empleado').equals(req.empleadoBDD).select("-createdAt -updatedAt -__v").populate('_id nombre cedula telefono direccion email usuario password token')
    res.status(200).json(empleados)
}
const detalleEmpleado = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Empleado ${id}`});
    const empleado = await Empleado.findById(id).select("-createdAt -updatedAt -__v").populate('_id nombre cedula telefono direccion email usuario password token')
    res.status(200).json(empleado)
}
const registrarEmpleado = async(req,res)=>{
    const {cedula} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarCedulaBDD = await Empleado.findOne({cedula})
    if(verificarCedulaBDD) return res.status(400).json({msg:"Lo sentimos, la cédula ya se encuentra registrada"})
    const nuevoEmpleado = new Empleado(req.body)
    await nuevoEmpleado.save()
    res.status(200).json({msg:"Registro exitoso del Empleado"})
}
const actualizarEmpleado = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Empleado ${id}`});
    await Empleado.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del Empleado"})
}
const eliminarEmpleado = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el Empleado ${id}`})
    await Empleado.findByIdAndDelete(id);
    res.status(200).json({msg:"Empleado eliminado exitosamente"})
}

export {
	perfilEmpleado,
    listarEmpleados,
    detalleEmpleado,
    registrarEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
}