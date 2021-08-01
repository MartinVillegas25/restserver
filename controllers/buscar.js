const { response} = require('express');
const {ObjectId} = require('mongoose').Types;
const{Usuario, Categoria, Producto}= require('../models/index')

const coleccionesPermitidas =[
    'usuarios',
    'productos',
    'categorias',
    'roles'
];

const buscarUsuario = async (termino='', res)=> {
     
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId) {
        const usuario = await Usuario.findById(termino);
       return res.json({
           result: (usuario) ? [usuario] : []
        })
    };

    const regexp = new RegExp(termino,'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre:regexp}, {correo:regexp}],
        $and: [{ estado:true}]
    });

    res.json({
        usuarios
    });

};

const buscarCategoria= async (termino='', res) => {
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId) {
        const categoria = await Categoria.findById(termino);
       return res.json({
           result: (categoria) ? [categoria] : []
        })
    };
    const regexp = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        nombre:regexp, estado:true
    }).populate('producto', 'nombre');

    res.json({
        categorias
    });


};

const buscarProducto = async (termino='', res) => {
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
       return res.json({
           result: (producto) ? [producto] : []
        })
    };
    const regexp = new RegExp(termino, 'i');
    const productos = await Producto.find({
        nombre:regexp, estado:true
    });

    res.json({
        productos
    });


};

const buscar= (req, res=response)=> {

    const {coleccion, termino}=req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
       return res.status(401).json({
            msg: 'Invalid coleccion'
        })
    };
    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res)
        break;
         case 'productos':
            buscarProducto(termino, res)
        break;
        case 'categorias':
            buscarCategoria(termino, res)
        break;

        default: res.status(401).json({
            msg:'problema en la busqueda'
        })
    }
  

};

module.exports={
    buscar
}