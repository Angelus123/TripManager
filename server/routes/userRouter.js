
import express, { Router } from "express";
import * as UserController from "../controllers/UserController";
import * as AuthController from "../controllers/AuthController"
import User from "../models/User";
const userRouter = express.Router()
userRouter.post('/login', AuthController.login)
userRouter.post('/signup', AuthController.signup)
userRouter.post('/forgotPasswor', AuthController.forgotPassword)
userRouter.patch('/updateMyPassword', AuthController.protect, AuthController.updatePassword)

userRouter.patch('/resetPassword/:token', AuthController.resetPassword)
userRouter.patch('/updateMe', AuthController.protect, UserController.updateMe)
userRouter.delete('/deleteMe', AuthController.protect, UserController.deleteMe)

userRouter.route("/")
                   
                   .post(UserController.createUser)
                   .get(UserController.getAlluser)  

userRouter.route('/:id')
                   .delete(UserController.deleteUser)
                   .patch(UserController.updateUser)
                   .get(UserController.getUser)
export default userRouter;
