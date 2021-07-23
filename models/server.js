
const express = require('express');
const cors = require('cors');

class Server{
     
     constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRouter = '/api/usuarios'
        
        //middlewares
        this.middlewares();

        // rutas de aplicacion
        this.routes();
     }

     middlewares(){

        //cors
        this.app.use(cors())

        // lectura y parseo del body
        this.app.use(express.json());


        // directoria de public
      this.app.use(express.static('public'));

     }

    routes(){
        
        this.app.use(this.usuariosRouter, require('../routes/usuarios'));

         
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log('server listening on port', this.port)
        })
    }


}




module.exports = Server;