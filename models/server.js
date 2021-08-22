
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');//esto es un npm para la carga de archivos
const {socketController} = require('../socket/controlador')


class Server{
     
     constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)
     
        this.paths={

            auth: '/api/auth',
            buscar: '/api/buscar',
            uploads: '/api/uploads',
            categorias: '/api/categorias',
            productos: '/api/productos',    
            usuarios: '/api/usuarios'
        }

       
        

        //conectar a base de datos 
        this.conectarDB();


        //middlewares
        this.middlewares();

        // rutas de aplicacion
        this.routes();

        //sockets

        this.sockets();
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

      //para el fileuploads, para subir archivos
      this.app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath: true
    }));

     }

    routes(){
        
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));

         
    }

    sockets(){
        this.io.on("connection", (socket) => socketController (socket, this.io) )
    }

    listen(){
        this.server.listen(this.port, ()=> {
            console.log('server listening on port', this.port)
        })
    }


}




module.exports = Server;