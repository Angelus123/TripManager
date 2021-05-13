import User from "../models/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync"
import factory from './handlerFactory'

const filterObj = (obj, ...allowedFields) =>{
    const newObj ={}
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj
}
export const createUser = factory.createOne(User)
    
//Get indv controll funct ion

    export const getUser = factory.getOne(User)

//Update controll function

export const updateMe= catchAsync(async (req,res,next)=>{
    //1. Create error if user POSTs password data
    if(req.body.password|| req.passwordConfirm){
        return next(new AppError("This Route is not for password updates. please use /UpdatePassword"))
    }
   let _id = {_id:req.user.id}
    //2. Filtered out unwanted fields namenot allowed to be updated
   const filterBody = filterObj(req.body, 'firstName','lastName','email','phone','gender','address')
    //3. If not update user docunent
    const updatedUser = await User.findByIdAndUpdate(_id, filterBody, {
        new:true,
        runValidators:true
    })
    
    res.status(200).json({
        status:"success", 
        data: {
            user: updatedUser
        }   
  })  

})


export const deleteMe= catchAsync(async (req,res,next)=>{

    let _id = {_id:req.user.id}
    await User.findByIdAndUpdate(_id, {active: false})

    res.status(204).json({
        status:'success',
        data: null
    })
})


  //Delete controll function
  export const deleteUser = factory.deleteOne(User)
      //Get All controll function
  export const getAlluser = factory.getAll(User)
  export const getMe = catchAsync(async(req, res, next) =>{
      req.params.id=req.user.id
      next()
  })
  export const getMine = factory.getOne(User)