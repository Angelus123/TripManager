import express from "express";
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'xss-clean'
import CommentRouter from "./routes/commentRoutes"
import articleRoute from "./routes/articleRouter"
import UserRouter from "./routes/userRouter"
import ReviewRouter from "./routes/reviewRoute"
import TourRouter from "./routes/tourRoute"

import * as globalErrorHandling from "./controllers/ErrorController"
import AppError  from "./utils/appError"

const app = express();
//Global middlewares
//Securit HTTP headers
app.use(helmet())
const limiter =rateLimit({
    max:10,
    windows:60*60*1000,
    message:'Too many request from this IP, Please try again in an hour'
})
//Limit request from same api
app.use('/api',limiter)
//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
//Data sanitization against NoSQL query injection
app.use(mongoSanitize())
//Data sanitization against:xss
app.use(xss())
//prevent parameter pollution
app.use(hpp( {
    whitelist:[
        'createdAt',
        'author'
    ]
}))

app.get('/', (req,res)=>{res.status(200).send({
    status:200, 
    message:'welcome to teamwork'
})
})
//Test middleware
app.use((req, res, next) => {
req.requestTime = new Date().toISOString();
// console.log(req.headers)
// console.log(x)
next()
})

// Route
app.use('/api/v1/comment',CommentRouter)
app.use('/api/v1/review',ReviewRouter)
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/tour',TourRouter)
app.use('/api/v1/article',articleRoute)

app.all('*', (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandling.globalErrorHandling)                                                                                                                                                                                                                                      
// module.exports = app;
export default app