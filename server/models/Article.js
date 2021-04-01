import validator from "validator";
import mongoose from "mongoose";
// import User from "./User"
    const artSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    article:{
        type: String,
        required: true
    },
    authorId:{
        type: String,
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
    }
},
{
    toJSON:{virtuals:true},
    toObject: {virtuals:true}
}
)

//===Imbedding
artSchema.virtual('comments',{
    ref:'Comment',
    foreignField:'articleId',
    localField:'_id',
   
})
// artSchema.set('toJSON',{virtuals:true})

// artSchema.set('toObject', {virtuals:true})


artSchema.pre(/^find/, function(next){
    this.populate(
        {
            path: 'authorInfo',
            select: '-__v -_id -passwordChangedAt -jobRole'
        }
    )
    next()
})
//let article = module.exports= mo.model('Article',artSchma);
const article = mongoose.model("Article", artSchema);
export default article;