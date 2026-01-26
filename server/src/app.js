const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser')
const createError = require ('http-errors')
const helmet = require('helmet');
const rateLimit =require ('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const app = express();

const rateLimiter = rateLimit({
  windowMs:1*60*1000,
  max:5,
  message:'Too mamny request form this ip, please try again later',
})
// Middleware

app.use(rateLimiter);
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.json());// for adding data to the request body
app.use(bodyParser.urlencoded({ extended: true }));


// routers

app.use("/api/users",userRouter)
app.use("/api/seed",seedRouter)

app.get('/test',rateLimiter, (req, res) => {
  res.status(200).send({
    message: 'api is working fine'
  });
});




// client error handeling


app.use((req,res,next)=>{
  next(createError(404,'route not found'));
});

// server error handeling --> all the errors 


app.use((err,req,res,next)=>{

  return errorResponse(res,{
    statusCode :err.status,
    message: err.message,
  })
});



 




module.exports =app;