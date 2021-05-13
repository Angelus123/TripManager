import catchAsync from '../utils/catchAsync'
import  Review from '../models/Review'
import AppError from '../utils/appError'
import factory from './handlerFactory'

exports.setTourAndUserId = catchAsync(async (req, res, next)=>{
    const name=req.user.firstName+" "+req.user.lastName
    if(!req.body.tourId) req.body.Tour=req.params.tourId
    if(!req.body.user) req.body.User =req.user.id
    if(!req.body.name) req.body.author=name
    console.log(req.body)
next()
})
export const createReview = factory.createOne(Review)
export const getReview = factory.getOne(Review)
export const deleteReview =factory.deleteOne(Review)
export const updateReview = factory.updateOne(Review)
export const getAllReview = factory.getAll(Review)