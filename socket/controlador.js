const {comprobarJwt}= require('../helpers/generar-jwt')
const {ChatMensajes} = require('../models/chat-mensajes')

const chatMensajes = new ChatMensajes();

const socketController =async (socket, io)=> {

    const token =socket.handshake.headers['x-token'];
    
    const usuario = await comprobarJwt(token);
    

    if(!usuario){
        return socket.disconnect();
    }

    //agregar usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //conectar a una sala especial
     
    socket.join(usuario.id)

    //limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr )
    })

    socket.on('enviar-mensaje',({uid, mensaje}) => {

        if(uid){
             chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
             socket.to(uid).emit('mensaje-privado', chatMensajes.ultimos10)
            
        }else{
            
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
         
    })


}

module.exports ={
    socketController
}