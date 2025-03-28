const User = require('../models/users');
const Product = require('../models/product');  

exports.postProduct = async(req, res) => {
    try{
        const {name, description, price, category, tag} = req.body;

        // ---product image
        let images = [];
        
        if (req.files) {
            images = req.files.map(file => file.path);
        }
        const seller = req.user._id;

        const newProduct = await Product.create({name, description, price, category, tag, images, seller});

        await User.findByIdAndUpdate(newProduct.seller, {
            $push: {productsPosted: newProduct._id}
        })

        return res.status(201).json({
            status: "success",
            message: "Product uploaded successfully"
        });

    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            status: "error",
            message: "Failed to upload product"
        });
    }
}

exports.updateProduct = async(req, res) => {
    try{
        const updateData = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: product
        });
    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            status: "error",
            message: "Failed to update product"
        });
    }
}

exports.deleteProduct = async(req, res) => {
    
    try{
        await Product.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { productsPosted: req.params.id }
        });

        return res.status(204).json({
            status: "success",
            message: "Product deleted successfully"
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Failed to delete product"
        });
    }
}

exports.getAllProducts = async(req, res) => {
    try{
        const seller = await User.findById(req.user._id).populate('productsPosted');
        const sellerProducts = seller.productsPosted;

        return res.status(200).json({
            status: "success",
            message: "Successfuly fetched all sellers product",
            data: sellerProducts || []
        });
        
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to fetch sellers products"
        });
    }
}

 