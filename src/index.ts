import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from 'morgan';

dotenv.config();

//importamos las rutas de usuarios 
import userRoutes from './routes/userRoutes.js';

mongoose.connect(process.env.DB_CONNECTION_STRING as string)
.then( ()=>{
    console.log("Base de datos conectada");
})
.catch(()=>{
    console.log("Error al conectarse a la base de datos");
});
const app =express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//Riuta para verificar qie el servidor se esta ejecutado 
app.get('/health', async (req: Request, res: Response) => {
    res.send({message:'!servidor OK!'});
});
app.get('/', async (req: Request, res: Response) => {
    res.redirect('/health');
})
app.use("/api/user", userRoutes);
const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Servidor corriendo en el puerto: " + port)
});
