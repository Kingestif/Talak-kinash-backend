const User = require('../models/users');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');

exports.protect = async(req,res,next) =>{       
    let token = '';
    try{
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){   
            token = req.headers.authorization.split(' ')[1];
        }
        
        if(!token){
            return res.status(401).json({
                status: "error",
                message:"Please login to get access!"
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);    

        const isalive = await User.findById(decoded.id);

        if(!isalive){       
            return res.status(401).json({
                status: "error",
                message:"User no longer exist!"
            });
        }

        req.user = isalive;     //(MANDATORY!!)this make data available for our next middleware
        next();

    }catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                status: "error",
                message:"Token expired please login again"
            });
        }


        return res.status(401).json({
            status: "error",
            message:error.message || "anauthorized access"
        });
    }

}

exports.verify = async(req, res, next) => {
    if(req.user.emailVerified === false){       
        return res.status(400).json({
            status: "error",
            message: "Please verify your email to do this operation"
        });
    }
    next();
}

exports.isUser = (req,res,next) =>{
    const userRole = req.user.role;

    if(userRole !== 'user'){
        return res.status(403).json({
            status: "error",
            message: "You must be a User to this operation",
        });
    }
    next();
}

exports.isAdmin = (req,res,next) =>{
    const userRole = req.user.role;

    if(userRole !== 'admin'){
        return res.status(403).json({
            status: "error",
            message: "You must be an Admin to do this operation",
        });
    }
    next();
}

exports.isSeller = (req,res,next) =>{
    const user = req.user;

    if(user.role !== 'seller' || user.sellerVerified === false){
        return res.status(403).json({
            status: "error",
            message: "You must be Seller to do this operation",
        });
    }
    next();
}

