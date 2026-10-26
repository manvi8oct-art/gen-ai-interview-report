const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistmodel = require("../models/blacklist.model");
const tokenBlacklistModel = require("../models/blacklist.model");

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
};

//register controller
/**
 * @name registerUserController
 * @description register an new User, expects username, email and password in the request body
 * @access Public 
 */
async function registerUserController(req, res) {

    const {userName, email,password} = req.body;
    if(!userName || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password!",

        })
    }
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{userName}, {email}]

    })
    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists with this email or username",
        })
    }
    const hash = await bcrypt.hash(password , 10);
    const user = await userModel.create({
        userName,
        email,
        password: hash,
    });
    const token = jwt.sign(
        {id: user._id , userName: user.userName},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
    )
    res.cookie("token", token, authCookieOptions);

    res.status(201).json({
        message: "User registered successfully!",
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email
        }
    });
        }

//login controller
/**
 * @name loginUserController
 * @description logins user and excepts email and password in the request body
 * @access Public 
 */

async function loginUserController (req,res) {
    const {email,password} = req.body;

    const user = await userModel.findOne({email});

    if(!user) {
        return res.status(400).json({
            message: "No user found with this email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "invalid email or password"
        });
    }

    const token = await jwt.sign(
        {id: user._id , userName: user.userName},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token", token, authCookieOptions);
     res.status(201).json({
        message: "User Logined successfully!",
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email
        }
    });


    

}
/**
 * @name logoutUserController
 * @description clears the token and adds the token to the blacklist
 * @access Public
 */
async function logoutUserController (req, res) {
    const token = req.cookies.token;

    if(token) {
        await tokenBlacklistModel.create({token});
    }
    res.clearCookie("token", {
        httpOnly: authCookieOptions.httpOnly,
        secure: authCookieOptions.secure,
        sameSite: authCookieOptions.sameSite
    });

    res.status(200).json({
        message: "User logout successfully!",
    });

}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */

async function getMeController (req,res) {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
        message: "User details fetched successfully!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}


module.exports = {
    registerUserController, 
    loginUserController,
    logoutUserController,
    getMeController 
};