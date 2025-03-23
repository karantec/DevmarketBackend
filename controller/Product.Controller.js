const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/Product.model");

// **Create a New Blog Post with Image Upload**
const createProduct = async (req, res) => {
  try {
    const { name, category,image,description, price, liveLink } = req.body;

    // Check if a team member with the same name & position already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: "Team member already exists" });
    }

    // Create new team member
    const newProduct = new Product({name, category,image,description, price, liveLink  });
    await newProduct.save();

    res.status(201).json({ message: "product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error in createTeam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const Products = await Product.find();

    if (!Products.length) {
      return res.status(404).json({ message: "No Product posts found" });
    }

    res.status(200).json(Products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Update Product**
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category,image,description, price, LiveLink } = req.body;

    let imageUrl = "";

    // Upload new image if provided
    if (image) {
      const result = await cloudinary.uploader.upload(image, { folder: "products" });
      imageUrl = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, image: imageUrl, description, price, LiveLink , updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Delete a Product**
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { createProduct, getAllProducts,getProductById, updateProduct, deleteProduct };
