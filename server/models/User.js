import validator from "validator"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const UserSchema =new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,'Please enter fir st name']
    },
    lastName:{
        type: String,
        required: [true,'Please enter last name']
    },
    phone: {
        type: String,
        required: [true,'Please enter phone']
    },
    gender: {
        type: String,
        required: [true,'Please enter gender'],
        enum:["male", "female"]
    },
    jobRole: {
        type: String,
        enum:["user", "guide", "lead-guide", "developer", "admin"],
        default:'user',
    },
    department: {
        type: String,
        required: [true,'Please enter department']
    },

    address: {
        type: String,
        required: [true,'Please enter address']
    },
    email:{
        type: String,
        required: [true,'Please enter email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail,"Please provide a valid email"]
    },
   
    password: {
        type: String,
        required:  [true,'Please enter password'],
        minlength: 8,
        select:false
    },
    passwordConfirm: {
        type: String,
        select:false,
        required: [true,'Re-type  password'],
        validate: {
            //this work on create and save only not update

            validator: function(el){
                return el === this.password
            },
        message: 'password not match'
        }
        
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default:true,
        select: false
    }

}); 
UserSchema.pre('save',async function(next){
    //Only run this if password was actualy modified
    if(!this.isModified("password")) return next();
    
    //hash password with cost 12
    this.password= await bcrypt.hash(this.password, 12)
    //Delete password confirm
    this.passwordConfirm =undefined
    next()

}) 
UserSchema.pre(/^find/, function(next){
    // this point to current querry
    // this.find({active:  true});
    this.find({active:{$ne:false}});
    next()
})

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
        // console.log(candidatePassword, userPassword)
    return await bcrypt.compare(candidatePassword,userPassword)

}
UserSchema.methods.changesPassordAfter = function(JWTTImestamp){
    if(this.passwordChangedAt){
        const changedTimestamp =parseInt(this.passwordChangedAt.getTime()/1000,
        10
        )
        // console.log(   ,"++++++++",JWTTImestamp,"hello")
        return JWTTImestamp<changedTimestamp
    }
    return false

}
UserSchema.methods.createPasswordResetToken = function () {
 const resetToken = crypto.randomBytes(32).toString('hex');
 this.passwordResetToken = crypto
 .createHash('sha256')
 .update(resetToken)
 .digest('hex')
//  console.log((resetToken)," newwwww", this.passwordResetToken)
 this.passwordResetExpires = Date.now()+10*60*1000
 
 return resetToken
} 


const User = mongoose.model('User', UserSchema)
export default User;

