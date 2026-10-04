const {Router} = require('express');
const authController = require ('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');


const authRouter = Router()



/**
 * @route POST/api/auth/register
 * @description Register a new user
 * @access Public 
 */

authRouter.post("/register",authController.registerUserController);

/**
 * @route POST/api/auth/login
 * @description Login user
 * @access Public
 */
authRouter.post("/login",authController.loginUserController);

/**
 * @route POST/api/auth/logout
 * @description clear token from  user cookie and add the token in blacklist
 * @access Public 
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route get/api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */

authRouter.get("/get-me", authMiddleware.authUser , authController.getMeController);




module.exports = authRouter;