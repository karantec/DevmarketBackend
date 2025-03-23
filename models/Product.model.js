const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Product Name (e.g., Restaurant Management System)
    category: { type: String, required: true }, // Category (e.g., Our Software, Business, etc.)
    images: { type: [String], required: true }, // Array of image URLs
    description: { type: String, required: true },
    price: { type: String, required: true },
    liveLink: { type: String, required: true } // Live demo or product link
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
