
const jwt = require('jsonwebtoken');
const { response} = require('express');
const Usuario = require('../models/usuario');

const validarJwt = async (req = request, res= response , next) => {
     
    const token = req.header('x-token');

    if(!token) {
        res.status(401).json({
            message:'el token debe ser ingresado'
        })
    }

    try {

        const {uid} =jwt.verify(token,process.env.JWTPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                message: 'token invalido - usuario no existe en BD'
            })
        };

        if(!usuario.estado){
            return res.status(401).json({
                message: 'token invalido - estado:false'
            })
        };

        req.usuario= usuario
        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })
    }

    


};

module.exports = {
    validarJwt
};


