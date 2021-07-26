const { response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');




const usuariosGet = async (req, res=response) => {
     //para poner propiedades como query, es el signo ? en la url
     // el estado:true es para que devuelva solo los usuarios activos, ya que cuando borramos un usuario pasamos su estado a false, no se borra de la base de datos.
  
    const {limite= 5, desde = 0}= req.query;
                       // const usuarios = await Usuario.find({estado:true})
                       //    .limit(Number(limite))
                       //    .skip(Number(desde));

                       // const total = await Usuario.countDocuments({estado:true});

    // como son dos await que no tienen nada que ver entre ellas, no estan relacionadas, si la dejamos asi, va a esperar que termine de buscar los usuarios para despues contarlos, lo que va a tardar mas tiempo, por eso utilizamos el Promise.all que realiza todas las promesas de forma simultanea 

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
       .limit(Number(limite))
       .skip(Number(desde))
    ])
       

    res.json({
        total,
        usuarios
    
    });
};


const usuariosPut= async (req, res=response) => {
    
    const id = req.params.id;
    const {_id, password, google, ...resto}=req.body;
    
    //validar contra bD
    if (password){
        const salt = bcryptjs.genSaltSync();//es el numero de vueltas para hacer mas complicada la encriptacion
    resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.send({
        usuario
    })
};

const usuariosPost= async (req, res =response) => {

    const {nombre, correo, password, rol} = req.body;
    // aca defino una nueva instancia, donde le digo que use los datos del body dentro de Usuario en el schema
    const usuario = new Usuario ({nombre, correo, password, rol});

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();//es el numero de vueltas para hacer mas complicada la encriptacion
    usuario.password = bcryptjs.hashSync(password, salt);


    // ahora le tengo que decir a mongoose que lo guarde en la base de datos

    await usuario.save();

    res.send({
        
        usuario
    })
};

const usuariosDelete= async (req, res =response) => {
    
    // lo que hago asi es cambiarle es estado al usuario, de este modo no lo borro de la base de datos, sino que hago que deje de aparcer en la lista de usuarios activos, para no perder al usuario de la BD y por consiguiente todos los registros modificados por el mismo.
    const {id} = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    
    res.json({
        usuario
    })
}



module.exports= {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}