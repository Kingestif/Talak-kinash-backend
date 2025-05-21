const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');

app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());

app.use('/api/v1/products', productRouter);

app.get("/", (req, res) => {
    res.send(" Service  Is  Running");
});

module.exports = app;
