const { response} = require('express');
const {Producto }= require('../models/index');




const obtenerProductos = async (req, res=response) => {
    const {limite= 5, desde = 0}= req.query;
    const query ={estado :true};
    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
       .populate('categoria','nombre')
       .populate('usuario', 'nombre')
       .limit(Number(limite))
       .skip(Number(desde))
    ]);

    res.json({
        total,
        productos
    })
};


const obtenerProducto = async (req, res=response) => {
    const {id}= req.params;
    
    const producto = await Producto.findById(id)
    .populate('categoria','nombre')
    .populate('usuario', 'nombre')

    res.json({
        producto
    })
}



const crearProducto = async (req, res=response) => {
    
    const {estado, usuario, ...body} = req.body

    const productoDb = await Producto.findOne({nombre: body.nombre})

    if(productoDb){
        res.status(401).json({
            msg: `el producto ${productoDb.nombre} ya existe`
        })
    };

    const data={
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
        
    };

    const producto = new Producto (data);
    await producto.save();

    res.status(200).json(producto)

};

const actualizarProducto= async (req, res=response) => {
    
    const {id} = req.params;
    const {estado, usuario, ...data}=req.body;

     if(data.nombre){
         data.nombre = data.nombre.toUpperCase()
     }

     data.usuario = req.body._id;
    
     const producto = await Producto.findByIdAndUpdate(id,data, {new:true});

    res.send({
        producto
    })
};

const borrarProducto = async (req, res =response) => {
    
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false});
    
    res.json({
       producto
    })
}

module.exports ={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}