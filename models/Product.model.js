const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product Name (e.g., Restaurant Management System)
    category: { type: String, required: true }, // Category (e.g., Our Software, Business, etc.)
    image: { type: String, required: true }, // Image URL
    description: { type: String, required: true } ,
    price:{type:String,required:true},
    liveLink:{type:String,required:true}// Short description of the product
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
