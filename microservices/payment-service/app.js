const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const paymentRouter = require('./routes/paymentRoutes');

app.use(cors());
app.use(morgan('dev')); 
app.use('/api/v1/payment/verify', bodyParser.raw({ type: 'application/json' }));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payment/verify') return next();
  express.json()(req, res, next);
});

app.use('/api/v1/payment', paymentRouter);

app.get("/", (req, res) => {
    res.send(" Service  Is  Running");
});

module.exports = app;
