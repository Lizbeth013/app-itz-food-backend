import express from 'express';
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { createCheckOutSession, stripeWebHookHandler } from '../controller/orderController.js';

const router = express.Router();

//Ruta post para crear una sesión de stripe
router.post("/create-checkout-session",
    jwtCheck, 
    jwtParse,
     createCheckOutSession);

     //Ruta para procesas laspeticiones del WebHook de stripe
     router.post("/checkout/webhook", stripeWebHookHandler);

     export default router;