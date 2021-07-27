const {response}= require('express');

const esAdminRol = (req, res=response, next) => {
   
    if(!req.usuario){
        return res.status(500).json({
            message:'se quiere verificar el rol sin antes verificar el token'
        })
    };

    const {rol, nombre}=req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            message:`el usuario:${nombre}, no es administrador. No puede realizar la tarea`
        })
    };

    next()


}

module.exports={
    esAdminRol
}