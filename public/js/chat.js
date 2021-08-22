
var url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth/'
: 'https://restserve01.herokuapp.com/api/auth/';


let usuario = null;
let socket = null;

//referencias

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensaje =document.querySelector('#ulMensaje');
const btnSalir=document.querySelector('#btnSalir');



//validar jwt del local storage
const validarJWT = async() => {

    const token = localStorage.getItem('token');

    if(token.length <=10){
        window.location = 'index.html';
        throw new Error('no hay token en el servidor');
    }

    const respuesta = await fetch( url, {
        headers: {'x-token': token}
    })
    .then(resp => resp.json())
    .then(({usuario:userDB, token:tokenDB}) => {
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre
    })
    .catch((err) => {
        console.log(err);
    })

    await conectarSocket();    
   
}


const conectarSocket = async()=> {
    
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=> {
        console.log('socket online');
    });

    socket.on('disconnect', ()=>{
        console.log('socket offline');
    });

    socket.on('recibir-mensajes',dibujarMensaje);

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', dibujarMensajePrivado)

}

const dibujarUsuarios =(usuarios=[])=>{
    
    let usersHtml = '';
    usuarios.forEach(({nombre, uid,imagen}) => {
       usersHtml += `
        <li>
        <p class="col-sm-5">
            
            <h5 class="text-success"> ${nombre}</h5>
            <span class=" fs-6 text-muted"> id: ${uid}</span> 
        
        </p>           
        </li>                
        `;
    });

    ulUsuarios.innerHTML=usersHtml

};

const dibujarMensaje =(mensajes=[])=>{
    
    let mensajesHtml = '';

    mensajes.forEach(({nombre, mensaje}) => {
       mensajesHtml += `
        <li>
        <p>
            <span class="text-success"> ${nombre}</span>
            <span>${mensaje}</span> 
        
        </p>           
        </li>                
        `;
    });

    ulMensaje.innerHTML=mensajesHtml
    

};

const dibujarMensajePrivado =(mensajes=[])=>{
    
    let mensajesHtml = '';

    mensajes.forEach(({nombre, mensaje}) => {
       mensajesHtml += `
        <li>
        <p> 
            <span class="text-success"> ${nombre}</span>
            <span>${mensaje}</span>
            <span>(mensaje privado)</span> 
        
        </p>           
        </li>                
        `;
    });

    ulMensaje.innerHTML=mensajesHtml
    

};


//el keyup son las teclas, cada tecla presionada tine un keyCode y el enter tiene el valor de 13, por lo que vamos a hacer es q solo se active el evento cuando se toca el enter
txtMensaje.addEventListener('keyup', ({keyCode})=>{
     const mensaje = txtMensaje.value;
     const uid= txtUid.value;

     if(keyCode!==13){return;} //que no pase nada si tocas cualquier tecla menos el enter
     if(mensaje.length===0){return;} //que no mande nada vacio

     socket.emit('enviar-mensaje', {mensaje, uid});

    form.reset();
     

})

const main = async ()=> {

    await validarJWT();

}

main();


