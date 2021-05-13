import { now } from "mongoose";
import Tour from "../models/Tour";
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
exports.setTourAndUserId = catchAsync(async (req, res, next)=>{
    req.body.authorId=req.user.id;
    req.body.guides=req.body.guides;
    req.body.author=req.user.firstName+" "+req.user.lastName
  next()
        })
            //create controll function
    export const createTour = factory.createOne(Tour)
            //get individual Tour controll function
    export const getTour = factory.getOne(Tour, {
        path: 'reviews',
        select: 'review'})
            //Delete controll function
    export const deleteTour = factory.deleteOne(Tour)
            //Update controll function
    export const updateTour= factory.updateOne(Tour)
        
          //Get All controll function
    export const getAllTour = factory.getAll(Tour)