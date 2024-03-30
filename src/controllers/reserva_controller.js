import Reserva from "../models/Reserva.js"
import Conferencista from "../models/Cliente.js"
import Auditorio from "../models/Auditorio.js"
import mongoose from "mongoose"

const infoReserva =(req,res)=>{
    delete req.reservaBDD.createdAt
    delete req.reservaBDD.updatedAt
    delete req.reservaBDD.__v
    res.status(200).json(req.reservaBDD)
}
const listarReservas = async (req,res)=>{
    const reservas = await Reserva.find({estado:true}).where('reserva').equals(req.reservaBDD).select("-createdAt -updatedAt -__v").populate('_id codigo descripcion id_conferencista id_auditorio')
    res.status(200).json(reservas)
}
const detalleReserva = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe la Reserva ${id}`});
    const reserva = await Reserva.findById(id).select("-createdAt -updatedAt -__v").populate('_id codigo descripcion id_conferencista id_auditorio')
    res.status(200).json(reserva)
}
const registrarReserva = async(req,res)=>{
    const {id_conferencista,id_auditorio,codigo} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const conferencistaBDD = await Conferencista.findById(id_conferencista);
    if (!conferencistaBDD) return res.status(400).json({ msg: "Lo sentimos, el Conferencista no se encuentra registrado" });
    const auditorioBDD = await Auditorio.findById(id_auditorio);
    if (!auditorioBDD) return res.status(400).json({ msg: "Lo sentimos, el Auditorio no se encuentra registrada" });
    const verificarCodigoBDD = await Reserva.findOne({codigo})
    if(verificarCodigoBDD) return res.status(400).json({msg:"Lo sentimos, el codigo ya se encuentra registrado"})
    const nuevoReserva = new Reserva(req.body)
    await nuevoReserva.save()
    res.status(200).json({msg:"Registro exitoso de la Reserva"})
}
const actualizarReserva = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe la Reserva ${id}`});
    await Reserva.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa de la Reserva"})
}
const eliminarReserva = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe la Reserva ${id}`})
    await Reserva.findByIdAndDelete(id);
    res.status(200).json({msg:"Reserva eliminada exitosamente"})
}

export {
	infoReserva,
    listarReservas,
    detalleReserva,
    registrarReserva,
    actualizarReserva,
    eliminarReserva
}