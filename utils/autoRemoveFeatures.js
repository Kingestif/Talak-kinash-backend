const Product = require("../models/product");

const removeExpiredFeaturedProducts = async () => {
    try {
        const now = new Date();
        await Product.updateMany(
            { isFeatured: true, featuredUntil: { $lte: now } },
            { isFeatured: false, featuredUntil: null }
        );
        console.log("Expired featured products removed");
    } catch (error) {
        console.error("Error removing expired featured products:", error);
    }
};

// removeExpiredFeaturedProducts();
// setInterval(removeExpiredFeaturedProducts, 60 * 60 * 1000);

module.exports = removeExpiredFeaturedProducts;
