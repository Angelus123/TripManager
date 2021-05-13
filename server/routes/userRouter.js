
import express, { Router } from "express";
import * as UserController from "../controllers/UserController";
import * as AuthController from "../controllers/AuthController"
import User from "../models/User";
const userRouter = express.Router()
userRouter.post('/login', AuthController.login)
userRouter.post('/signup', AuthController.signup)
userRouter.post('/forgotPasswor', AuthController.forgotPassword)
userRouter.use(AuthController.protect)
userRouter.patch('/updateMyPassword',AuthController.updatePassword)

userRouter.patch('/resetPassword/:token', AuthController.resetPassword)
userRouter.patch('/updateMe', UserController.updateMe)
userRouter.delete('/deleteMe', UserController.deleteMe)
userRouter.get('/me', UserController.getMe,UserController.getMine)

userRouter.route("/")
                   
                   .post(UserController.createUser)
                   .get(UserController.getAlluser)  

userRouter.route('/:id')
                   .delete(UserController.deleteUser)
                   .get(UserController.getUser)
export default userRouter;
