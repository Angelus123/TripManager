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
}

)
tourSchema.virtual('review', {
    ref:'Review',
    localField: '_id',
    foreignField: 'tour'
  
})
tourSchema.set('toJSON',{virtuals:true})

tourSchema.set('toObject', {virtuals:true})

// tourSchema.pre(/^find/, function(next){
//     this.populate(
//         {
//             path: 'guides',
//             select: 'firstName'
//         }
//     )
//     this.populate(
//         {
//             path: 'authorInfo',
           
//         }
//     )
//     next()
// })
//Virtual Populate

//let article = module.exports= mo.model('Article',artSchma);
const Tour = mongoose.model("tour", tourSchema);
export default Tour;