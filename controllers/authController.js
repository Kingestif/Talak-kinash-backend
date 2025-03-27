const User = require('../models/users');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');


exports.signup = async(req,res,next)=>{
    
    try{
        let referringUserId = null;
    
        if (req.body.referredBy) {
            const referringUser = await User.findOne({ referralCode: req.body.referredBy });
            if (!referringUser) {
                return res.status(400).json({ message: "Invalid referral code" });
            }
            referringUserId = referringUser._id; 
        }
        
        const newuser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            role: req.body.role,
            gender: req.body.gender,
            birthday:  new Date(req.body.birthday),
            identification: req.body.identification,
            referredBy: referringUserId
        });

        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        newuser.verificationToken = hashedToken;
        
        await newuser.save();

        newuser.password = undefined;
        
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const verificationUrl = `${baseUrl}/api/v1/auth/verify/${verificationToken}`;

        // Send email
        await sendEmail({
            email: newuser.email,
            subject: 'Verify your email',
            message: `Click the link to verify your email: ${verificationUrl}` 
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered! Please check your email for verification.'
        });

    }catch(error){
        if (error.code === 11000) {
            return res.status(400).json({
                status: "error",
                message: `User with ${Object.keys(error.keyPattern)[0]} already exists`
            });
        }

        res.status(500).json({
            status: 'error',
            message: error.message
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

exports.verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
        }

        user.emailVerified = true;   
        user.verificationToken = undefined; 
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({
            status: "success",
            message: "Email verified successfully", 
            token: token,
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

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
    const user = req.user;

    if(user.role !== 'seller' || user.sellerVerified === false){
        return res.status(403).json({
            status: "error",
            message: "Your not authorized to do this operation",
        });
    }
    next();
}


