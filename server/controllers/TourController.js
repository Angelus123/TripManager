import { now } from "mongoose";
import Tour from "../models/Tour";
import User from "../models/User";
import catchAsync from "../utils/catchAsync"
import comment from '../models/Comment';
import AppError from "../utils/appError";

const filterObj = (obj, ...allowedFields) =>{
    const newObj ={}

    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj
}
export const createTour = catchAsync(async (req,res,next)=>{
    let tourInfo= {};


    tourInfo.name=req.body.name;
    tourInfo.description=req.body.description;
    tourInfo.startLocation=req.body.startLocation;
    tourInfo.locations=req.body.locations;
    tourInfo.authorId=req.user.id;
    tourInfo.guides=req.body.guides;
        console.log(tourInfo)
        const author=req.user.firstName+" "+req.user.lastName
    tourInfo.author=author;
    const newTour = await Tour.create(tourInfo);
    res.status(201).json({
        status:"success",
        newTour
            })
        })

    export const getTour = catchAsync(async(req,res,next)=>{
        // const comments = await comment.find({articleId:req.params.id})
        const tours= await Tour.findById(req.params.id).populate('review')
      
        // const user = await User.find({_id:{$in:Article.guides}})
        if(!tours) {
            return next( new AppError("No article found with that ID",404))
        }
                res.status(200).json({
                    status : 'success',
                    data: {
                        tours
                    }
            })
        })

    //Update controll function
    export const updateTour = catchAsync(async (req,res,next)=>{
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
      export const deleteTour= catchAsync(async (req, res, next) => {
    
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
    export const getAllTour = catchAsync(async (req,res,next) => {
        console.log("===========")
        const allTours = await Tour.find({})
        console.log(allTours,"===========")
        res.status(200).json({
            status:"success", 
            results: allTours.length,
            data:{
                allTours
            }
    
        })
        })