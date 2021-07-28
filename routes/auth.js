const { Router} = require('express');
const { check } = require('express-validator');
const { login, googleSingin } = require('../controllers/auth');
const {validarCampos}= require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'el correo no es valido').isEmail(),
    check('password', 'la contraseña no es correcta').not().isEmpty(),
    validarCampos
] ,login );

router.post('/google',[
    check('id_token', 'el id_token es obligatorio').not().isEmpty(),
    validarCampos
] , googleSingin );

module.exports = router;