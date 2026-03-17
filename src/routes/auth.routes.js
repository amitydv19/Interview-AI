const { Router } = require('express')
const authController = require("../controllers/auth.controller")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/api/login", authController.loginUserController)


module.exports = authRouter