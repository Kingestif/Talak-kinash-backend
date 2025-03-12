const user = require('../models/users');

exports.postProduct = async(req, res) => {
    try{
        res.status(201).json({
            status: "success",
            message: "Product uploaded successfully"
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to upload product"
        });
    }
}

exports.updateProduct = async(req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Product updated successfully"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to update product"
        });
    }
}

exports.deleteProduct = async(req, res) => {
    try{
        res.status(204).json({
            status: "success",
            message: "Product deleted successfully"
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: "Failed to delete product"
        });
    }
}




 