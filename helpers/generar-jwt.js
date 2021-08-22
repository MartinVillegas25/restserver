const jwt = require('jsonwebtoken');
const {Usuario}= require('../models/index')


const generarJwt = (uid='') => {

    return new Promise ((resolve, reject) => {
     
    const payload = {uid};

    jwt.sign(payload, process.env.JWTPRIVATEKEY, {
        expiresIn:'4h'
    },(err, token)=>{
        
        if (err) {
            console.log(error);
            reject('No se pudo generar el token')
        }else{
            resolve(token);
        }

    })


})
};

const comprobarJwt = async(token= '')=> {
     
    try {
        
        if(token.length<10){
            return null
        }
        
     const { uid }=  jwt.verify(token, process.env.JWTPRIVATEKEY);
    
     const usuario = await Usuario.findById(uid);
     
     
     
     
     if(usuario){
         if(usuario.estado){
             return usuario
         }else{
             return null;
         }
     }else{
         return null;
     }

    } catch (error) {
        return null;
    }
}


module.exports = {
    generarJwt,
    comprobarJwt
}