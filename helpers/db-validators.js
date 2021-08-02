const Role = require ('../models/role');
const {Categoria, Usuario, Producto}= require('../models/index')

const esRoleValido = async (rol= '')=>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error('el rol no esta registrado en la base de datos')
    }
};

const emailExiste = async (correo= '')=> {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error('el correo ingresado ya esta registrado')  
    };
};      

const existeUsuarioPorId = async (id)=> {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`el usuario con el ID ${id} no existe`)  
    };
};

const existeCategoriaPorId =  async (id)=> {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`la categoria con el ID ${id} no existe`)  
    };
};

const existeProductoPorId =  async (id)=> {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`el producto con el ID ${id} no existe`)  
    };
};

//validar si existe coleccion
const coleccionesPermitidas = (coleccion='', colecciones=[])=> {

    const incluida = colecciones.includes(coleccion);
    if(! incluida){
         throw new Error(`la coleccion: ${coleccion} no es permitida, ${colecciones}`)
    }
  return true;
}
   
module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}