const miFormulario = document.querySelector('form');

var url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/usuarios/'
: 'https://restserve01.herokuapp.com/api/usuarios/';

miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();
    const formData = {};

    for( let el of miFormulario.elements){
          if(el.name.length > 0){
              formData[el.name]= el.value;
          }
    }

    fetch( url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-type': 'application/json'
    }
    })
    .then(resp => resp.json())
    .then(({msg}) => {
        if(msg){
            return console.log(msg)
        }
        window.location = 'index.html';
    })
    .catch((err) => {
        console.log(err);
    })
})