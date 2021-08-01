const { Router} = require('express');
const { check } = require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const {esAdminRol}= require('../middlewares/validar-rol')
const {crearCategoria, obtenerCategorias,obtenerCategoria,actulizarCategoria, borrarCategoria}= require('../controllers/categorias');
const {existeCategoriaPorId}= require('../helpers/db-validators');



const router = Router();


//ruta para obtener todas las catergorias - publico
router.get('/', obtenerCategorias);


//ruta para obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,obtenerCategoria);


//crear categoria - privado- cualquier rol
router.post('/',[
    validarJwt,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria);


//actulizar categoria, cualquier rol-privado
router.put('/:id',[
    validarJwt,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,actulizarCategoria);


//borrar categoria- privado - admin_role
router.delete('/:id',[
    validarJwt,
    esAdminRol,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,borrarCategoria);

module.exports = router;