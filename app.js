const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const chapaRouter = require('./routes/chapaRoutes');
const authRouter = require('./routes/autoRoutes');


app.use(morgan('dev')); 

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use(express.json()); 

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sellers', sellerRouter);
app.use('/api/v1/chapa', chapaRouter);
app.use('/api/v1/auth', authRouter);


module.exports = app;
