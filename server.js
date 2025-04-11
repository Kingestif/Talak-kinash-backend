const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const removeExpiredFeaturedProducts = require("./utils/autoRemoveFeatures");
dotenv.config({path: '.env'});

mongoose.connect(process.env.DATABASE).then(()=>{
    console.log('mongoose connected');
}).catch((err)=>{
    console.log('Database connection error', err);
});

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server started running on port ${port}`);
});
