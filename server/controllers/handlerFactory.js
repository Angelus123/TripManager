import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

exports.createOne = Model => catchAsync(async (req, res, next)=>{
    const newDoc= await Model.create(req.body)
    res.status(200).json({
        status:'success',
        data:{
            newDoc
        }
    })
})


exports.getOne = (Model, popOption)  => catchAsync(async(req,res,next)=>{
    let query =Model.findById(req.params.id)
    console.log(popOption)
    if(popOption) query =query.populate(popOption)
    // const comments = await comment.find({articleId:req.params.id})
    const doc= await query
    console.log(doc)
    // const user = await User.find({_id:{$in:Article.guides}})
    if(!doc) {
        return next( new AppError("No Document found with that ID",404))
    }
            res.status(200).json({
                status : 'success',
                data: {
                    doc
                }
        })
    })



exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    let query = {_id:req.params.id}
    const document= await Model.findByIdAndDelete(query)

    if(!document) {
        return next( new AppError("No document found with that ID",404))
    }
    res.status(200).json({
        status:"success", 
        data:null
    })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    let _id = {_id:req.params.id}
    //2. Filtered out unwanted fields namenot allowed to be updated
    const filterBody = req.body
    //3. If not update user docunent
    const doc= await Model.findByIdAndUpdate(_id, filterBody, {
        new:true,
        runValidators:true
    })

    if(!doc) {
        return next( new AppError("No documment found with that ID",404))
    }

    res.status(200).json({
        status:"success", 
        data: {
            doc
        }   
    })  
})

exports.getAll= Model =>catchAsync(async (req,res,next) => {
    //To allow for nested GET reviews o tour
    let filter = {}
    if((req.params.tourId)) filter = {tour:req.params.tourId}
    const allDoc=  await Model.find(filter)
    res.status(200).json({ 
        status:"success", 
        results: allDoc.length,
        data:{
            allDoc
        }

    })
    })
