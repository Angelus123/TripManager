import User from "../models/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync"


const filterObj = (obj, ...allowedFields) =>{
    const newObj ={}

    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj
}
export const createUser = catchAsync(async (req,res,next)=>{

    const newUser = await User.create(req.body);//inpostman
    res.status(201).json({
        status:"success",
        newUser
            })
        })

    
//Get indv controll funct ion

    export const getUser = catchAsync(async(req,res,next)=>{
        const user= await User.findById(req.params.id)
                res.status(200).json({
                   status:"success",
                   user
                
            })
        })

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

export const updateUser= catchAsync(async (req,res,next)=>{

    let user= {}
   user.firstName=req.body.firstName
   user.lastName=req.body.lastName
   user.phone=req.body.phone;
   user.gender=req.body.gender;
   user.department=req.body.department;
   user.address=req.body.address;
   user.email=req.body.email;

    let query = {_id:req.params.id}
 
    const updateUser = await User.updateOne(query, user)
            res.status(200).json({
                status:"Updated success",  
                updateUser 
          })  
       })
  //Delete controll function
  export const deleteUser = catchAsync(async (req, res, next) => {

     let query = {_id:req.params.id}
  const user = await User.deleteOne(query)
        res.send('Deleted Successfully')      
    
})

      //Get All controll function
export const getAlluser = catchAsync(async (req,res,next) => {
   
    const alluser = await User.find({})
        res.send(alluser)
     })
