import dotenv from "dotenv"
process.on('uncaughtException', err => {
  console.log(err.name,err.message)
  console.log('uncaught Exception * Shutdown')
  process.exit(1)
})      
import app from "./index";
import mongoose from "mongoose";   
dotenv.config({ path: "./config/config.env" }); 

const port = process.env.PORT;

const DB = process.env.DATABASE; 
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }).then(()=> console.log(" Db connection done successfully"))
 

const server = app.listen(port, () =>
  process.stdout.write(`Listening on port ${port} ...\n******************** \n`)
);
process.on('unhandledRejection', err => {
  console.log(err.name,err.message)
  console.log('Unhundled rejection * Shutdown')
  server.close(()=>
  process.exit(1))
})

                                                                                                                                                                                                                                                 