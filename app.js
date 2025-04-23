const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const chapaRouter = require('./routes/chapaRoutes');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(morgan('dev')); 

// raw body parser 
app.use('/api/v1/chapa/verify', bodyParser.raw({ type: 'application/json' }));

//express.json for everything else (skip the chapa webhook)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/chapa/verify') return next();
  express.json()(req, res, next);
});

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
