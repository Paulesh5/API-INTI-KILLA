import {Schema, model} from 'mongoose'
import mongoose from 'mongoose'

const ReservaSchema = new Schema({
    codigo:{
        type:Number,
        require:true,
        trim:true
    },
    descripcion:{
        type:String,
        require:true,
        trim:true
    },
    id_conferencista:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conferencista'
    },
    id_auditorio:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Auditorio'
    }

},{
    timestamps:true
})

export default model('Reserva',ReservaSchema)