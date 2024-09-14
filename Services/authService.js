const User = require('../Models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const axios = require('axios')


const register = async (userObj)=>{
    // check if user already exists
    const oldUser = await User.findOne({email:userObj.email}).exec();
    // return false to show an error if user already exists
    if (oldUser){return null}
    const newUser = new User(userObj);
    console.log(newUser);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password,salt);
    await newUser.save();
    console.log(newUser);
    return newUser;    
}


const login = async (email, password) => {
    // find user with email
    const user = await User.findOne({ email: email }).exec();
    // return false to show an error if user not found
    if (!user){return null}
    // check is the password matches that in db
    const match = await bcrypt.compare(password, user.password);
    // return false to show an error if password does not match
    if (user.password !== password){return null}
    // return user if password matches
    return user;
}


const updateUserWithToken = async (id, refreshToken) => {
    // find user and update the refresh token field with new refresh token
    try{
        await User.updateOne({ _id: id }, { refreshToken: refreshToken }).exec();
    }catch(err){
        console.log(err);
        return true;
    }
}

const generateToken = (user) => {
    // generate access token
    const accessToken = jwt.sign({UserInfo:{ id: user._id }}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    // generate refresh token
    const refreshToken = jwt.sign({UserInfo:{ id: user._id }}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '3d'
    })
    return { accessToken, refreshToken } 
}

const verifyToken = async (token, secrete) => {
    // verify token
    const id = jwt.verify(token, secrete, (err, decoded) => {
        if (err) {
          // Token is invalid or expired
          console.error('JWT verification failed:', err);
          return null;
        } else {
          // Token is valid
          console.log('JWT verified successfully:', decoded.UserInfo.id);
          
          return decoded.UserInfo.id;
        }
      });
      return id;
    }

const getGoogleOauthToken= async (code)=>{
    try{
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.G0OGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: 'authorization_code'
        });
        return tokenResponse.data;
    }catch(e){
        throw e;
    }
    
}

const getGoogleUser = async (access_token, id_token)=>{
    try{
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`,
            }
        });
        return response.data;
    }catch(e){
        throw new Error(e.message);
    }
}

const creatOrUpdateUserGoogle= async (query,userObj,option)=>{
    return await User.findOneAndUpdate(query,userObj,option).exec();
}

 const authService = {
    login,
    updateUserWithToken,
    generateToken,
    register,
    verifyToken,
    getGoogleOauthToken,
    getGoogleUser,
    creatOrUpdateUserGoogle
};
module.exports= authService;