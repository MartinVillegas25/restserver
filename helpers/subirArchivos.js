
const Path = require('path');

const { v4: uuidv4 } = require('uuid');

const subirArchivos = (files,extensionesPermitidas = ['jpg', 'png', 'gif', 'jpeg'], carpeta='' )=>{

   return new Promise((resolve, reject) => {
    
  
    const {archivo} = files;
    

    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length -1];
     
    if(!extensionesPermitidas.includes(extension)){
        return reject(` la extension ${extension} no esta permitida - ${extensionesPermitidas}`);
    };
  
    const nombreFinal = uuidv4() + '.' + extension;
  
    const uploadPath = Path.join(__dirname , '../uploads/', carpeta ,  nombreFinal);
  
    archivo.mv(uploadPath, function(err) {
      if (err) {
        return reject (err);
      }
  
     resolve(nombreFinal);
    });
   })

}

module.exports ={
    subirArchivos
}