//review,rating/createdAt/ ref to tour /ref to user

import mongoose from "mongoose";

const reviewSchema =new mongoose.Schema({
    review:{
        type:String,
        required:[true, 'Review can not be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    author:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tour:{
            type:mongoose.Schema.ObjectId,
            ref:'tour'
        }
    ,
    User:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to a user']
    } 

},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true }
}

)
reviewSchema.pre(/^find/,async function(next){
 
    this.populate({
        path:'User',
        select: 'firstName'
    })
    this.populate({
        path:'Tour',
        select: '-guides name'
        
    })
})

const Review = mongoose.model('Review',reviewSchema)
export default Review