import crypto from'crypto'
import {promisify}from 'util'
import User from "../models/User"
import article from "../models/Article";
import catchAsync from "../utils/catchAsync"
import jwt from 'jsonwebtoken'
import AppError from '../utils/appError'
import * as  send from '../utils/email'

const signToken = id => {
   return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN  
      })
}
const createSendToken =(user, statusCode,res) => {
    const token =signToken(user._id)
    const cookieOptions = {
        expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV === 'production')cookieOptions.secure=true
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined
    res.status(statusCode).json({
        status : 'success',
        token,
        data: {
           user
        }
})
}


export const signup = catchAsync(async(req, res, next) =>{
console.log(req.requestTime )
    const newUser =await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt:req.requestTime 
    })
    createSendToken(newUser,201,res)

})

export const login = catchAsync(async (req,res,next) => {
    const {email,password} = req.body
     //1)check if email &pwd exist
    if(!email||!password){
         return next(new AppError('Please provide email and password!',400))
    }
    //2)check if the user exist & password is correct
    const user = await User.findOne({email}).select('+password')
      if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('Incorrect email or password',401))
      }
    //3)if everything ok , send token to nclient 
    createSendToken(user,200,res)

})
export const protect = catchAsync(async (req, res, next)=> {
    //1 Getting tocken and check its there
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
        token =req.headers.authorization.split(' ')[1]
    }
    // console.log(token)
    if(!token){ 
        return next(new AppError('You are not logged in! Please login to get access', 401))
    } 

    // 2. verificatoin token

   const decoded= await  promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decoded)
    // 3.check if user still exists
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
    
        return next(new AppError('The token belonging to this use does no long exist.', 401))
    }
    // 4.check if user changed password after  the token was issued
    if(freshUser.changesPassordAfter(decoded.iat)){
        return next(
            new AppError('user recently changed password! Please login again.', 404)
        )
    } 
    //5Grant Access to protected route
    req.user = freshUser

    next();
})   
exports.restrictTo =(...roles) =>{
    return async (req, res, next) => {
        //roles ['admin', developer].role='user'
        const Article = await article.findById(req.params.id)
        if(!(roles.includes(req.user.jobRole)||req.user.id === Article.authorId)){
            return next(
                new AppError('You do not have permission to perform this action', 403)
            )
        }
        next()
    }
}  
export const forgotPassword =  catchAsync(async (req, res, next ) => {
    // 1 Get user based on post email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError("There is no user with that email address", 404))
    }
    // 2.Generate random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})
    //3.Send it to user's email
    const resetURL =`${req.protocol}://${req.get(
        'host'
        )}/api/v1/user/resetPassword/${resetToken}`
        const message =`Forgot your password? Submit a PATCH with your new password and passwordConfirm to:${resetURL}.\n
         If you didn't forget your password, please ignore this email.`
        // console.log(resetURL)
        // console.log(user.email)

        try{
           
          
            await  send.sendEmail({
                email:user.email,
                subject:'Your password reset token(valid for 10 min',
                message
            })
            console .log("hello")
            res.status(200).json({
                status:'success',
                message:'token sent to email'
            })
 

        }catch(err){
          
            user.createPasswordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save ({ validateBeforeSave: false})
                
                return next(new AppError('There was an error sending the email. Try again later!', 500)) 
        }
    })

export const resetPassword =catchAsync(async (req, res, next ) => {
    //1 Get user based on the token
 
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
    console.log(hashedToken)

    const user = await User.findOne({ 
        passwordResetToken: hashedToken
        ,passwordResetExpires: {$gt:Date.now()}
    })
    // .where("passwordResetExpires").gt(Date.now())
    console.log(user) 
    //2 If token has not  expired, and there is user  set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired',400))

    }
 
    user.password =req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken= undefined
    user.passwordResetExpires = undefined
    await user.save()

    //3. Update changedPasswordAt property for the user

    //4. Log the user in, send jwt

    createSendToken(user,200,res)
    
})
export const updatePassword = catchAsync(async (req, res, next) =>{
    const {oldPassword, newPassword , passwordConfirm}=req.body
    // 1. Get current user 
    const user= await User.findById(req.user.id).select('+password')
    console.log(req.user.id)
    // 2. Check if posted password is correct
    if(!(await user.correctPassword(oldPassword, user.password))){
  return next(new AppError('Your current password is wrong.',401))
    }

    // 3. If so update password
     
    user.password =newPassword
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken= undefined
 
    await user.save()
    // why we cannot use ..findByIdAndUpdate.
    //user.findByIdAndUpdate will not work as intended

    // 4. log user in send jwt
    createSendToken(user,200,res)
})