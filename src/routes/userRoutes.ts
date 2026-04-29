import express from 'express';
import { createUser,  getUser, updateUser } from '../controller/userController.js';
import { jwtCheck , jwtParse} from '../middleware/auth.js';
import {validateUserRequest} from '../middleware/validation.js'

const router=express.Router();

//Ruta para guardar un usuarrioo
router.post('/', jwtCheck, createUser);

//Ruta para analizar un usuario 
router.put('/', jwtCheck, jwtParse,validateUserRequest, updateUser)

//uta para obtenerr un usuario 
router.get('/', jwtCheck, jwtParse,getUser);

export default router;