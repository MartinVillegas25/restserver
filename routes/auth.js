const { Router} = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const {validarCampos}= require('../middlewares/validar-campos');

const router = Router();

router.get('/login',[
    check('correo', 'el correo no es valido').isEmail(),
    check('password', 'la contraseña no es correcta').not().isEmpty(),
    validarCampos
] ,login );

module.exports = router;