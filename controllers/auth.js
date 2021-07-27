const { response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs= require('bcryptjs');
const {generarJwt} = require('../helpers/generar-jwt')

const login = async (req, res=response)=> {

    const {correo, password} = req.body;

    try {
        //verificar correo 
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.json({
                msg: "el correo y/o la contraseña son incorrectas---correo"
            })
        };


        // verificar si el usuario esta activo
        if(usuario.estado===false){
            return res.json({
                msg: "el correo y/o la contraseña son incorrectas---estado:false"
            })
        };



        //verificar la contraseña 
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.json({
                msg: "el correo y/o la contraseña son incorrectas---password",
            })
            
        };



        //general jwt

        const token = await generarJwt(usuario.id);
    
    
        res.json({
            usuario,
            token
            
        });


    }catch (error) {
       console.error(error);
       return res.status(500).json({
           msg: " algo salio mal, comunicarse con el administrador"
       })
    };

};

module.exports = {
    login
}