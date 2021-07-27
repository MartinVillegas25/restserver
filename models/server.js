
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
     
     constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRouter = '/api/usuarios';
        this.authPath = '/api/auth';
        

        //conectar a base de datos 
        this.conectarDB();


        //middlewares
        this.middlewares();

        // rutas de aplicacion
        this.routes();
     }

     async conectarDB() {
          await dbConnection(); 
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
        
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosRouter, require('../routes/usuarios'));

         
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log('server listening on port', this.port)
        })
    }


}




module.exports = Server;