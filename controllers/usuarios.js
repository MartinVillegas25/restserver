const { response} = require('express')

const usuariosGet = (req, res=response) => {
     //para poner propiedades como query, es el signo ? en la url
     const {name, edad=30} = req.query;

    res.send({
        msg: ' get hola',
        name,
        edad
    })
};


const usuariosPut= (req, res=response) => {

    const id = req.params.id;
    res.send({
        msg: ' put hola',
        id
    })
};

const usuariosPost= (req, res =response) => {

    const body = req.body;
    res.send({
        msg: ' post hola',
        body
    })
};

const usuariosDelete= (req, res =response) => {
    res.send({
        msg: ' delete hola'
    })
}



module.exports= {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}