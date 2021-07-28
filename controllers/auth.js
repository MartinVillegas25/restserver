const { response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs= require('bcryptjs');
const {generarJwt} = require('../helpers/generar-jwt');
const {googleVerify} = require('../helpers/google-verify');

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

const googleSingin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, imagen } = await googleVerify( id_token );
       

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            
            // Tengo que crearlo
           const data = {
               nombre, 
               correo, 
               password: ':)',
               imagen, 
               rol: 'USER_ROLE',
               google: true
           }
            
            usuario = new Usuario (data);

            await usuario.save();
        }
        
        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        
        // Generar el JWT
        const token = await generarJwt( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}

module.exports = {
    login,
    googleSingin
}