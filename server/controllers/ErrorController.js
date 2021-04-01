import AppError from "../utils/appError"

const handleValidationErrorDB = err => {
    // const value = err.message.match(/"(?:[^\\"]+|\\.)*"/)
    const errors = Object.values(err.errors).map(el => el.message)
    // const value = err.message
    // const value = err.keyValue.title
    const message =`Invalid input:${errors.join(' ')}`
    // console.log(err,'uuuuuuuuuuuuu')
    return new AppError(message, 400)
}
const handleDuplicateFieldsDB = err => {
    // const value = err.message.match(/"(?:[^\\"]+|\\.)*"/)
    // const value = err.message.match(/(["'])(\\?.)*?\1/)[0]
    // const value = err.message
    const value = err.keyValue.title
    const message =`Duplicate field value:${value}. Please use another value!`
    // console.log(message,'uuuuuuuuuuuuu')
    return new AppError(message, 400)
}
const handleCastErrorDB = err => {
   
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const sendErrorForDev = (err,res) => { 

    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
}
const sendErrorForProd = (err,res) => {
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message:err.message
        })
    //programming error and other Unkown error: We don't want to leak error details
    }else{
        //1) Log error
        console.error("ERROR***", err)
        //2) Send generic message
        res.status(500).json({
            status:'error',
            message:'Somethng went very wrong!'
        })
    }
  }

export const  globalErrorHandling = (err,req,res,next) => { 
      console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
   
    const environment = process.env.NODE_ENV
 
    if(environment ==='development'){
        console.log(environment)
        sendErrorForDev(err, res)
    }
    
    else if(environment ==='production'){
        let error = err
        // console.log(error)
         if(err.name=== 'CastError') error = handleCastErrorDB(error)
         if(err.code === 11000) error = handleDuplicateFieldsDB(error)
         if(err.name === 'ValidationError') error = handleValidationErrorDB(error)
          
        sendErrorForProd(error,res) 
    }
}