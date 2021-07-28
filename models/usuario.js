const {Schema, model}= require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, ' el  nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, ' el  email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, ' la contraseña es obligatorio']
    },
    imagen: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        defaut: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']//CON Esto defino que roles estan habilitados, o es el uno o el otro.
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default:false
    }



});

UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id,...usuario}= this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model('Usuario', UsuarioSchema); // el model de mongoose te pide un nombre de la coleccion y el schema al que esta asociado ese schema, el es nombre que le va a dar.
