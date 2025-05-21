require("dotenv").config();  
const app = require('./app');
const mongoose = require('mongoose');
const removeExpiredFeaturedProducts = require("./utils/autoRemoveFeatures");
const cron = require('node-cron');
const swaggerDocs = require("./swagger");

mongoose.connect(process.env.DATABASE).then(()=>{
    console.log('mongoose connected');

    swaggerDocs(app);

    const port = process.env.PORT;
    app.listen(port, ()=>{
        console.log(`Server started running on port ${port}`);
    });

    removeExpiredFeaturedProducts();

    // Schedule to run every hour (at minute 0) to remove expired promoted products
    cron.schedule('0 * * * *', () => {
        console.log(`[${new Date().toISOString()}] Running scheduled cleanup...`);
        removeExpiredFeaturedProducts();
    });

}).catch((err)=>{
    console.log('Database connection error', err);
});