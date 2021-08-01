const { response} = require('express');
const {Categoria  }= require('../models/index')


const obtenerCategorias = async (req, res=response) => {
    const {limite= 5, desde = 0}= req.query;
    const query ={estado :true};
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true}).populate('usuario','nombre')
       .limit(Number(limite))
       .skip(Number(desde))
    ]);

    res.json({
        total,
        categorias
    })
};


const obtenerCategoria = async (req, res=response) => {
    const {id}= req.params.id;
    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json({
        categoria
    })
}



const crearCategoria = async (req, res=response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = await Categoria.findOne({nombre})

    if(categoriaDb){
        res.status(401).json({
            msg: `la categoria ${nombre} ya existe`
        })
    };

    const data={
        nombre,
        usuario: req.usuario._id,
    };

    const categoria = new Categoria (data);
    await categoria.save();

    res.status(200).json(categoria)

};

const actulizarCategoria= async (req, res=response) => {
    
    const {id} = req.params.id;
    const {estado, usuario, ...data}=req.body;

    data.nombre = data.nombre.toUpperCase;
    data.usuario =req.usuario._id;
 
    const categoria = await Categoria.findByIdAndUpdate(id,data, {new:true});

    res.send({
        categoria
    })
};

const borrarCategoria = async (req, res =response) => {
    
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});
    
    res.json({
       categoria
    })
}

module.exports ={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actulizarCategoria,
    borrarCategoria
}