const { Router} = require('express');
const { check } = require('express-validator');
const {cargarArchivo, actualizarImagenCloudinary ,mostrarImagen}= require('../controllers/uploads');
const Path = require('path');
const {coleccionesPermitidas} = require('../helpers/db-validators')


const {validarCampos}= require('../middlewares/validar-campos');

const router = Router();

router.post('/',cargarArchivo);

router.put('/:coleccion/:id',[
    check('id', 'el id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id',[
    check('id', 'el id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos 
], mostrarImagen)



module.exports = router;