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