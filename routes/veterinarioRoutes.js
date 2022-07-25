import  express  from "express";
import { 
    registrar,
     perfil,
     confirmar,
     autenticar,
     oldvidePassword,
     comprobarToken,
     nuevoPassword,
     actualizarPerfil,
     actualizarPassword
 } from "../controllers/veterinarioController.js";
 import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// área publica 
router.post('/',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login',autenticar);
router.post('/olvide-password', oldvidePassword);  //validar el email usuario
//router.get('/olvide-password/:token',comprobarToken); // leer y confirmar el token
//router.post('/olvide-password/:token',nuevoPassword); // alamacenar el nuevo password
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// área privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password',checkAuth,actualizarPassword);

export default router; 