import {type Request, type Response} from 'express';
import User from '../model/userModel.js';


//Funcion para crearr un usuario
export const createUser=async(req:Request,res:Response):Promise<any>=>{
    //1.Verificar si el usuario ya existe en la db 
    //2. Crear el usuario si no existe
    //3.Regresar un objetoo usuario cliente (frontEnd)
    try{
        const {auth0Id}=req.body;
        const existingUser=await User.findOne({auth0Id});
        if (existingUser){//El usuario ya existe enla bd 
            return res.status(200).json(existingUser)

        }
        const newUser= new User(req.body);
        await newUser.save();
        res.status(201).json(newUser.toObject());
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Error al crear el usuario'});

    }

};//Fin del createUser
//Funcion para acttualizar los datos del usuarrio
export const updateUser=async(req:Request, res:Response):Promise<any>=>{
    try{
        const {name, address, city, country}=req.body;
        //Buscamos en la bd el usuario que inicio sesiomn 
        const user=await User.findById(req.userId);
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        user!.name=name;
        user!.address=address;
        user!.city=city;
        user!.country=country;

        await user!.save();
        res.send(user);


    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Error al actualizar el usuario'})

    }
}
//Funcion para obtener los datos del usuario 
export const getUser = async(req:Request, res:Response):Promise<any>=>{
    try{
        const currentUser = await User.findById({_id: req.userId});
        if(!currentUser){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.json(currentUser);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Error al obtener el usuario'});
    }
}