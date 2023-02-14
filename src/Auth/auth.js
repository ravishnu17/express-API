const jwt= require('jsonwebtoken')

const secret_key= process.env.secret_key;

const generateToken=(data)=>{
    return jwt.sign(data,secret_key,{expiresIn:'60m'});
}

const authenticateToken=(req,res,next)=>{
    const tokenHead= req.headers['authorization'];
    const token= tokenHead && tokenHead.split(' ')[1];
    if(token){
        jwt.verify(token,secret_key,(err, data)=>{
            if(!err){
                req.tokenData= data;
                next();
            }else{
                res.status(403).send("Forbidden");
            }
        });

    }else{
        res.status(401).send("Unauthorized");
    }
}

module.exports= {generateToken,authenticateToken}