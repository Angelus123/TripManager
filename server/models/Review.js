//review,rating/createdAt/ ref to tour /ref to user

import mongoose from "mongoose";
import Tour from "./Tour";

const reviewSchema =new mongoose.Schema({
    review:{
        type:String,
        required:[true, 'Review can not be empty']
    },
    rating:{
        type:Number,
        min:[1,'Rating must be above 1.0'],
        max:[5, 'Rating must be below 5.0'],
        set : val => Math.round(val * 10) /10
    },
    author:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    Tour:{
        type:mongoose.Schema.ObjectId,
        ref:'tour',
        required:[true,'Review must belong to a user']
    },

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
 reviewSchema.index({Tour:1, User: 1},{unique:true})
reviewSchema.pre(/^find/,async function(next){
 
    this.populate({
        path:'Tour',
        select:'name'
       
   
    })
    this.populate({
        path:'User',
        select:'firstName'
        
    })
})
reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([{
        $match:{Tour: tourId}
    },
    {
        $group: {
            _id:'$Tour',
            nRating:{$sum:1},
            avgRating: {$avg:'$rating'}
        }
    }
])
console.log(stats)
if(stats.length>0){
    await Tour.findByIdAndUpdate(tourId, 
        {ratingAverage:stats[0].avgRating,
         ratingQuantity:stats[0].nRating} )
}
 else {
    await Tour.findByIdAndUpdate(tourId, 
        {ratingAverage:4.5,
         ratingQuantity:0 })
      }
 }

reviewSchema.post('save', function(){
    this.constructor.calcAverageRatings(this.Tour)

  
}) 
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r =await this.findOne()

    next()
})
reviewSchema.post(/^findOneAnd/, async function(){
console.log('==',this.r.Tour)
   await this.r.constructor.calcAverageRatings(this.r.Tour)

})

const Review = mongoose.model('Review',reviewSchema)
export default Review
