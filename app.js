const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const chapaRouter = require('./routes/chapaRoutes');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const cors = require('cors');

app.use(cors());
app.use(morgan('dev')); 

// app.use((req,res,next)=>{
//     req.requestTime = new Date().toISOString();
//     next();
// });


app.use(express.json()); 

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sellers', sellerRouter);
app.use('/api/v1/chapa', chapaRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);

app.get("/", (req, res) => {
    res.send(" Service  Is  Running");
});

app.use((err, req, res, next) => {
    console.error(err.stack);  

    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        error: err 
    });
});

module.exports = app;
