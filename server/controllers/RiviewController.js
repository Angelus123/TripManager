import catchAsync from '../utils/catchAsync'
import  Review from '../models/Review'
import AppError from '../utils/appError'

export const createReview = catchAsync(async (req, res, next)=>{
    let reviewInfo = {}
    reviewInfo.review =req.body.review
    reviewInfo.rating =req.body.rating
    console.log(req.body.Tour)
    reviewInfo.tour =req.body.tour
    reviewInfo.User=req.user.id
    const name=req.user.firstName+" "+req.user.lastName
    reviewInfo.author=name;
    const newReview = await Review.create(reviewInfo)
    res.status(200).json({
        status:'success',
        data:{
            newReview
        }
    })
})

export const getReview = catchAsync(async(req,res,next)=>{

    const review= await Review.findById(req.params.id)
  

    // const user = await User.find({_id:{$in:Article.guides}})
    if(!review) {
        return next( new AppError("No article found with that ID",404))
    }
            res.status(200).json({
                status : 'success',
                data: {
                    review,
                   
                    
                }
        })
    })

//Update controll function
export const updateReview = catchAsync(async (req,res,next)=>{
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

res.status(200).json({
    status:"success", 
    data: {
        articles,
     
    }   
})  

})

  //Delete controll function
  export const deleteReview= catchAsync(async (req, res, next) => {

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
export const getAllReview = catchAsync(async (req, res, next)=>{
    const allReview = await Review.find({})
    res.status(200).json({
        status:'success',
        data:{
            allReview 
        }
    })
})