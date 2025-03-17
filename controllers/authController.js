const User = require('../models/users');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');


exports.signup = async(req,res,next)=>{
    try{
        const newuser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        newuser.password = undefined;

        const token = jwt.sign({id: newuser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(201).json({
            status: "success",
            message: "User Created successfully",
            token: token,
            data: {
                user: newuser
            },
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: error.message || "Failed to create user",
        });
    }
}

exports.login = async(req,res,next) =>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                status: "error",
                message:"Please Provide email and password",
            });
        }

        const user = await User.findOne({email}).select('+password');

        if(!user || !await user.checkPassword(password, user.password)){
            return res.status(401).json({
                status: "error",
                message:"Incorrect email or password",
            });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({
            status: "success",
            token: token,
        });

    }catch(error){
        return res.status(401).json({
            status: "error",
            message:error.message || "Error trying to log in"
        });
    }
}

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
    try{
        req.user.role = "seller";
        console.log("User verified successfully");
        next();
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to verfiy user please make sure you have inserted required documents"
        });
    }
}

exports.isUser = (req,res,next) =>{
    const userRole = req.user.role;

    if(userRole !== 'user'){
        return res.status(403).json({
            status: "error",
            message: "Your not authorized to do this operation",
        });
    }
    next();
}

exports.isAdmin = (req,res,next) =>{
    const userRole = req.user.role;

    if(userRole !== 'admin'){
        return res.status(403).json({
            status: "error",
            message: "Your not authorized to do this operation",
        });
    }
    next();
}

exports.isSeller = (req,res,next) =>{
    const userRole = req.user.role;

    if(userRole !== 'seller'){
        return res.status(403).json({
            status: "error",
            message: "Your not authorized to do this operation",
        });
    }
    next();
}