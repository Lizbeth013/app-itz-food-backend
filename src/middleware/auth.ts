import { type Request, type Response, type NextFunction } from "express";
import {auth} from "express-oauth2-jwt-bearer";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
//Instanciamos dotenv para variables de ambiente 
dotenv.config()
//Agregamos el userId y auth0Id al objeto request 
declare global {
  namespace Express{
    interface Request{
      userId:string,
      auth0Id:string
    }
  }
}
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || '',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
  tokenSigningAlg: 'RS256' ,
});

 
export const jwtParse=async (req: Request, res:Response, next:NextFunction):Promise<any>=>{
  //Los headers comenzaran cn una cadena Bearer token, por ejemplo Bearer 1234xelsfasds
  //Porr lo tanto, es necesario verfifcar que la autorizacioon coomience 
  //con la cadena bearer
  const {authorization}=req.headers;
  if(!authorization || !authorization.startsWith('Bearer')){
    return res.status(401).json({message:'Autorizacion denegada'});
  }
  //Obtenemos el token del headerr
  //Bearer 1234xelsfasds <__Convertir a un arreglo
  //.    [0
  //split )["Bearer", "1234xelsfasds"]
  const token =authorization.split(" ") [1];
  try{
    const decoded=jwt.decode(token || "") as jwt.JwtPayload
    const auth0Id=decoded.sub || "";
    const user=await User.findOne({auth0Id});
    if(!user){
      return res.status(401).json({message: 'Authorización denegada'});
    }
    req.auth0Id=auth0Id as string;
    req.userId=user._id.toString();
    next();
  }catch(error){
    return res.status(401).json({message:'Authorizacion denegada'});
  }
};