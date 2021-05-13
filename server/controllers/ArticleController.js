import { now } from "mongoose";
import article from "../models/Article";
import User from "../models/User";
import catchAsync from "../utils/catchAsync"
import comment from '../models/Comment';
import AppError from "../utils/appError";
import factory from './handlerFactory'

const filterObj = (obj, ...allowedFields) =>{
    const newObj ={}

    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj
}
export const createArticle = catchAsync(async (req,res,next)=>{
    let articleInfo= {};
    articleInfo.title=req.body.title;
    articleInfo.article=req.body.article;
    articleInfo.authorId=req.user.id;
    articleInfo.authorInfo=req.user.id;
    const name=req.user.firstName+" "+req.user.lastName
    articleInfo.author=name;
    
  
    const newArticle = await article.create(articleInfo);
    res.status(201).json({
        status:"success",
        newArticle
            })
        })

    export const getArticle = catchAsync(async(req,res,next)=>{
        let newObj ={}
        //  const comments = await comment.find({articleId:req.params.id})
        const Article = await article.findById(req.params.id)
        .populate({
            path: 'comments',
            select: 'comment'})
      
  
        
        // const user = await User.find({_id:{$in:Article.guides}})
        if(!Article) {
            return next( new AppError("No article found with that ID",404))
        }
                res.status(200).json({
                    status : 'success',
                    data: {
                        Article ,
                        // comments
                        
                        
                    }
            })
        })

    //Update controll function
    export const updateArticle = catchAsync(async (req,res,next)=>{
        //1. Create error if user POSTs password data
 
   let _id = {_id:req.params.id}
    //2. Filtered out unwanted fields namenot allowed to be updated
   const filterBody = filterObj(req.body, 'title','article','guides')
    //3. If not update user docunent
    const articles = await article.findByIdAndUpdate(_id, filterBody, {
        new:true,
        runValidators:true
    })
    
    if(!articles) {
        return next( new AppError("No article found with that ID",404))
    }
    const comments = await comment.find({articleId:req.params.id})
    res.status(200).json({
        status:"success", 
        data: {
            articles,
            comments
        }   
  })  

})

      //Delete controll function
      export const deleteArticle = catchAsync(async (req, res, next) => {
    
        let query = {_id:req.params.id}
        const articleDeleted= await article.findByIdAndDelete(query)
        await comment.deleteMany({articleId:query})
        if(!articleDeleted) {
            return next( new AppError("No article found with that ID",404))
        }
        res.status(200).json({
            status:"success", 
            data:null
    
        })
    })
    
          //Get All controll function
    export const getAllArticles = catchAsync(async (req,res,next) => {
        const articles = await article.find({})
        res.status(200).json({
            status:"success", 
            results: articles.length,
            data:{
                articles
            }
    
        })
        })