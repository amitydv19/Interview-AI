const { Router } = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middlewares")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @describe Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @describe Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @route GET/api/auth/logout
 * @describe clear Token from user cookie and add the token blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET/api/auth/get-me
 * @describe get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter