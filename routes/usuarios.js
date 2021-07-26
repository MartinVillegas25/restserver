const { Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost,usuariosDelete } = require('../controllers/usuarios');
const {validarCampos}= require('../middlewares/validar-campos');
const {esRoleValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators')


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido),
    validarCampos
],usuariosPut );

router.post('/',[
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('nombre', 'el nombre no es valido').not().isEmpty(),
    check('password', 'el password no es valido, debe tener mas de 6 letras').isLength({ min: 6}),
    // check('rol', 'no es un rol un permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    

    // asi verificamos si esta el rol en la base de datos, con la propiedad custom
    check('rol').custom( esRoleValido),
    validarCampos

] ,usuariosPost );

router.delete('/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] ,usuariosDelete );



module.exports = router;
