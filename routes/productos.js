const { Router} = require('express');
const { check } = require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const {esAdminRol}= require('../middlewares/validar-rol')
const {crearProducto, obtenerProductos, obtenerProducto,actualizarProducto, borrarProducto}= require('../controllers/productos');
const {existeProductoPorId,existeCategoriaPorId}= require('../helpers/db-validators');



const router = Router();


//ruta para obtener todos los productos - publico
router.get('/', obtenerProductos);


//ruta para obtener un producto por id - publico
router.get('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,obtenerProducto);


//crear producto - privado- cualquier rol
router.post('/',[
    validarJwt,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es un ID valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] , crearProducto);


//actulizar producto, cualquier rol-privado
router.put('/:id',[
    validarJwt,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,actualizarProducto);


//borrar producto- privado - admin_role
router.delete('/:id',[
    validarJwt,
    esAdminRol,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,borrarProducto);

module.exports = router;