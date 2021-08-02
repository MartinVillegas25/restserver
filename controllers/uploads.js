const { response} = require('express');
const {Usuario, Producto}= require('../models/index')
const Path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {subirArchivos} = require('../helpers/subirArchivos');


const cargarArchivo =  async (req, res=response) => {

if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg: 'No hay archivos para cargar'});
    return;
  };
  
  try {
    const nombre = await subirArchivos(req.files, undefined,'imagenes');
    
    res.json({nombre})
  } catch (msg) {
     res.json({
        msg
      })
  }
  
};

const actualizarImagen= async (req, res=response)=> {
     
if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  res.status(400).json({msg: 'No hay archivos para cargar'});
  return;
};
  
     const{ id , coleccion}= req.params;

     let modelo;

     switch (coleccion) {
       case 'usuarios': 
          
         modelo = await Usuario.findById(id);
         if(!modelo) {
           return res.status(404).json({ msg: `no existe usuario con el id ${id}` });
         };
         
         break;
         case 'productos': 
          
         modelo = await Producto.findById(id);
         if(!modelo) {
           return res.status(404).json({ msg: `no existe producto con el id ${id}` });
         };
         
         break;
     
       default:
         return res.status(500).json({ msg: ' no esta validado ese item'})

     }

     //verificar si existe la propiedad imagen en el modelo 

     if(modelo.imagen){
       //hay que borrar las imagenes previas
       const pathImagen = Path.join(__dirname, '../uploads', coleccion, modelo.imagen);
       if(fs.existsSync(pathImagen)){
         fs.unlinkSync(pathImagen);
       }
     };

     const nombre = await subirArchivos(req.files, undefined,coleccion);
    modelo.imagen = nombre;

     await modelo.save();
     
     res.json(modelo)
};

const actualizarImagenCloudinary= async (req, res=response)=> {
     
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg: 'No hay archivos para cargar'});
    return;
  };
    
       const{ id , coleccion}= req.params;
  
       let modelo;
  
       switch (coleccion) {
         case 'usuarios': 
            
           modelo = await Usuario.findById(id);
           if(!modelo) {
             return res.status(404).json({ msg: `no existe usuario con el id ${id}` });
           };
           
           break;
           case 'productos': 
            
           modelo = await Producto.findById(id);
           if(!modelo) {
             return res.status(404).json({ msg: `no existe producto con el id ${id}` });
           };
           
           break;
       
         default:
           return res.status(500).json({ msg: ' no esta validado ese item'})
  
       }
  
       //verificar si existe la propiedad imagen en el modelo 
  
       if(modelo.imagen){
          const nombreArr = modelo.imagen.split('/');
          const nombre = nombreArr[nombreArr.length - 1];
          const [ id_publico] = nombre.split('.');
          cloudinary.uploader.destroy(id_publico);
       };

       const {tempFilePath} = req.files.archivo;
       const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

       modelo.imagen = secure_url;
      
       await modelo.save();
       
       res.json(modelo)
  };

const mostrarImagen = async (req, res=response)=> {
  
  const{ id , coleccion}= req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios': 
       
      modelo = await Usuario.findById(id);
      if(!modelo) {
        return res.status(404).json({ msg: `no existe usuario con el id ${id}` });
      };
      
      break;
      case 'productos': 
       
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(404).json({ msg: `no existe producto con el id ${id}` });
      };
      
      break;
  
    default:
      return res.status(500).json({ msg: ' no esta validado ese item'})

  }

  //verificar si existe la propiedad imagen en el modelo 

  if(modelo.imagen){
    //hay que borrar las imagenes previas
    const pathImagen = Path.join(__dirname, '../uploads', coleccion, modelo.imagen);
    if(fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen);
    }
  };

  
  const noImagen = Path.join(__dirname, '../assets', 'no-image.jpg');
  res.sendFile(noImagen);

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};

