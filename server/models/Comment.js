import mongoose from 'mongoose'

 const commentSchemma = new mongoose.Schema({
    comment:{
        type:String,
        maxlength:100,
        required:[true,'Please enter Comment']
    },
    createdAt:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.ObjectId,
        required:[true,'Comments must belong to a user']
    },
    articleId:{
        type:mongoose.Schema.ObjectId,
        required:[true,'Comments must belong to a Article']
    }
})
const Comment = mongoose.model('Comment',commentSchemma);
export default Comment