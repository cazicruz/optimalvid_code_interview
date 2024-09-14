const Users = require('../Models/userModel');
const authService = require("../Services/authService");
const userService = require('../Services/userServices');
const { referrerCode } = require('../Services/userServices');
const userServices = require('../Services/userServices');
const emailService = require('../Services/emailService');
const bcrypt = require('bcrypt');


const register = async (req,res)=>{
    const {firstName,lastName ,password,email,phoneNumber,DoB,sex,country}= req.body;
    if(!firstName||!password||!email||!lastName||!phoneNumber||!sex||!country){
        return res.status(400).json({
            status:'error',
            msg:'firstName, password, lastName,phone number,sex, email and country are required'});
    }
    
    const userObj ={
        firstName:firstName,
        lastName:lastName,
        password:password,
        email:email,
        phoneNumber:phoneNumber,
        DoB:DoB || null,
        sex:sex,
        country:country
    };
    const newUser = await authService.register(userObj);
    if(newUser){
        const tokens = authService.generateToken(newUser);
        await authService.updateUserWithToken(newUser._id,tokens.refreshToken);
        const result = await emailService.welcomeMail(newUser.lastName,newUser.email);
        return res.status(200).json({message: 'registration complete',
                                    user:newUser,
                                    tokens:tokens});
    }
    return res.status(400).json({
        status:400,
        msg:'User already exists'})
}



const login = async (req,res)=>{
    const {email,password} = req.body;
    const user = await authService.login(email,password);
    if(!user){
        return res.status(400).send('Invalid credentials')
    }
    const tokens = authService.generateToken(user);
    await authService.updateUserWithToken(user._id,tokens.refreshToken);
    return res.status(200).json(tokens);
}


const tokenRefresh = async (req,res)=> {
    const {refreshToken} = req.body;
    if(!refreshToken){
        return res.status(401).send('Access denied, token missing')
    }
    try{
        // verifies if the token is valid and gets the payload
        const userId = await authService.verifyToken(refreshToken,process.env.REFRESH_TOKEN_SECRET);

        if (!userId){
            return res.status(500).send('try again later or login');
        }
        // checks if user exists in the db
        const user = await Users.findById(userId).exec();
        // generates a new set of tokens
        if(!user){
            return res.status(401).send('Access denied, token invalid');
        }

        const token = authService.generateToken({_id:user.id});
        // save the refresh token in database
        const error = await authService.updateUserWithToken(userId,token.refreshToken);
        if (error){
            return res.status(500).send('server error please login again');
        }
        // send the new token pair back to the client
        return res.status(200).json(token);
    }catch(err){
        console.log(err);
        // Token can be expired or invalid. Send appropriate errors in each case:
        return res.status(401).send('You are not authorized, login required')
    }
}

const forgotPass = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).send('Email is required')
    }
    const user = await userService.findUserByEmail(email);
    if(!user){
        return res.status(400).send('User not found')
    }
    const otp = await emailService.sendOTP(user.username,user.email);
    console.log(otp)
    if(!otp){
        return res.status(500).send('Error sending OTP')
    }
    const timestamp = Date.now();
    user.otp = otp;
    user.otp_date = timestamp;
    await user.save();
    return res.status(200).json({
        msg:'OTP sent successfully',
        timestamp:timestamp,        
    });
}

const resetPass = async (req,res)=>{
    const {email,otp,password} = req.body;
    if(!email||!otp||!password){
        return res.status(400).send('All fields are required')
    }
    const user = await userService.findUserByEmail(email);
    if(!user){
        return res.status(400).send('User not found')
    }
    if(user.otp !== otp && parseInt(user.otp) !== parseInt(otp)){
        return res.status(400).send('Invalid OTP')
    }
    const now = Date.now();
    const diff = now - user.otp_date;
    const diffInMinutes = Math.round(diff/(1000*60));
    if(diffInMinutes > 10){
        return res.status(400).send('OTP expired')
    }
    user.password = password;
    user.otp = null;
    user.otp_date = null;
    await user.save();
    return res.status(200).send('Password updated successfully')
}

const googleOauth_init = async (req,res)=>{
    const rootURL= 'https://accounts.google.com/o/oauth2/v2/auth';
    const client_id= process.env.GOOGLE_CLIENT_ID
    const response_type= 'code';
    const scope= 'email profile';
    const redirect_uri= process.env.GOOGLE_OAUTH_REDIRECT_URL;
    const access_type="offline";
    const state= process.env.GOOGLE_OAUTH_STATE;

    return res.redirect(`${rootURL}?client_id=${client_id}&response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}&access_type=${access_type}&state=${state}`)
}

const googleOauth_code= async(req,res)=>{
    const {code,state} = req.query;
    if(!code){
        return res.status(400).send('Access denied, code missing')
    }
    if(state !== process.env.GOOGLE_OAUTH_STATE){
        return res.status(400).json({msg:'possible CSRF attack'})
    }

    const {access_token,id_token} = await authService.getGoogleOauthToken(code);
    if(!access_token || !id_token){
        return res.status(400).send('Access denied, code invalid')
    }

    const user= await authService.getGoogleUser(access_token,id_token);
    if(!user){
        return res.status(400).send('Access denied, code invalid')
    }
    const userObj = {
        username:user.email,
        email:user.email,
        password:user.id,
        firstName:user.given_name,
        lastName:user.family_name,
        googleId:user.id,
        };
    const newUser = await authService.creatOrUpdateUserGoogle({email:user.email},
                                                                userObj,
                                                                {
                                                                    upsert:true,
                                                                    new:true
                                                                });
    
    const tokens = authService.generateToken(newUser);
    await authService.updateUserWithToken(newUser._id,tokens.refreshToken);

    return res.status(200).json({ message: 'Code received and processed',
                                  user:newUser,
                                  tokens:tokens
                                });
   
    // await authService.updateUserWithToken(user.id,token.refreshToken);
    // return res.status(200).json(token);
}


 const authController = {
    register,
    login,
    tokenRefresh,
    forgotPass,
    resetPass,
    googleOauth_init,
    googleOauth_code,
}
module.exports = authController

