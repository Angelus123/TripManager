import validator from "validator";
import mongoose from "mongoose";
// import User from "./User"
    const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
    },
    ratingAverage:{
        type: Number,
        default:4.5,
        set : val => Math.round(val * 10) /10
    },
    ratingQuantity:{
        type: Number,
        default:0
    },
    price:{
        type: Number,
        default:0
    },
    priceDiscount:{
        type: Number,
        default:0
    },

  
    createdAt:{
        type: Date,
        default:Date.now()
    },
    author:{
        type: String,
        required: true
    },

    authorInfo:{
        type:mongoose.Schema.ObjectId,
        ref: 'User'
    },
    startLocation: {
        type:{
            type:String,
            default:'Point',
            enum: ["Point" ]   
        },
        coordinates:[Number],
        address:String,
        description:String,
    },
    locations: [
        {
        type: {
            type:String,
            default: 'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }
    ],
    guides: [
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
  
    // guides: Array
},{
    toObject:{virtuals:true},
    toJSON: {virtuals:true}
}

)
tourSchema.virtual('reviews', {
    ref:'Review',
    localField: '_id',
    foreignField: 'Tour'
  
})
// tourSchema.set('toJSON', {virtuals:true})

// tourSchema.set('toObject', {virtuals:true})

const Tour = mongoose.model("tour", tourSchema);
export default Tour;