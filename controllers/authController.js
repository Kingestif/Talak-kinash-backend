const User = require('../models/users');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const validator = require('validator');


exports.signup = async(req,res,next)=>{
    
    try{
        const {name, email, phoneNumber, password, role, gender, birthday, referredBy, shopName, storeLocation, storeLink, chapaApi} = req.body;

        // ----------Image
        let identification = null;
        if (req.file) {
            identification = req.file.path; 
        }
        
        //-----------Store URL
        if(storeLink){
            if (!validator.isURL(storeLink, { require_protocol: true })) {
                return res.status(400).json({ message: "Invalid URL format. Please provide a valid URL with http or https." });
            }
        }
        
        //----------Referral
        let referringUserId = null;
        if (referredBy) {
            const referringUser = await User.findOne({ referralCode: referredBy });
            if (!referringUser) {
                return res.status(400).json({ message: "Invalid referral code" });
            }
            referringUserId = referringUser._id; 
        }

        //----------Birthdate
        let formattedBirthday = null;
        if(birthday){
            formattedBirthday = new Date(birthday);
        }
        
        const newuser = await User.create({name, email, phoneNumber, password, role, gender, birthday: formattedBirthday, identification, referredBy: referringUserId, shopName, storeLocation, storeLink, chapaApi});
        
        // ------------verificationToken
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        newuser.verificationToken = hashedToken;
        
        await newuser.save();

        newuser.password = undefined;
        
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const verificationUrl = `${baseUrl}/api/v1/auth/confirmation-link/${verificationToken}`;
        console.log(baseUrl);

        // Send email
        await sendEmail({
            email: newuser.email,
            subject: 'Verify your email',
            message: `Click the link to verify your email: ${verificationUrl}` 
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered! Please check your email for verification.',
            user: newuser
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
            role: user.role
        });

    }catch(error){
        return res.status(401).json({
            status: "error",
            message:error.message || "Error trying to log in"
        });
    }
}

exports.confirmLink = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(400).send("<h1>Invalid or expired token</h1>");
        }

        return res.send(`
            <h1>Email Verification</h1>
            <p>Click the button below to verify your email.</p>
            <form action="${process.env.BASE_URL}/api/v1/auth/verify/${req.params.token}" method="POST">
                <button type="submit">Verify Email</button>
            </form>
        `);

    } catch (err) {
        res.status(500).send("<h1>Server error</h1>");
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
        }

        if (user.emailVerified) {
            return res.redirect(`${process.env.FRONTEND_URL}?message=Already Verified`);
        }
        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.redirect(`${process.env.FRONTEND_URL}`);

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message});
    }
};
