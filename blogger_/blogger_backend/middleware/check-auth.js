const HttpError = require("../models/http-error");
const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    // before sending some post requests some browser send options request
    if(req.method==="OPTIONS"){
        return next();
    }
    try{
        const token=req.headers.authorization.split(' ')[1];//Authorization: 'BEARER token'
        if(!token){
            throw new HttpError('Authentication failed');
        }
        const decodedToken=jwt.verify(token,process.env.JWT_KEY);
        req.userData={userId:decodedToken.userId};
        next();
    } catch(err){
        return next(new HttpError('Authentication failed!'),400);
    }
}