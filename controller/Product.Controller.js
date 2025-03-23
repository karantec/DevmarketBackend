const { cloudinary } = require("../config/cloudinary");
const Product = require("../models/Product.model");

// **Create a New Product with Multiple Image Uploads**
const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, liveLink, images } = req.body;

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    let imageUrls = [];

    // Upload multiple images to Cloudinary if provided
    if (images && images.length > 0) {
      const uploadPromises = images.map((image) => cloudinary.uploader.upload(image, { folder: "products" }));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    // Create new product
    const newProduct = new Product({
      name,
      category,
      images: imageUrls,  // Store multiple image URLs
      description,
      price,
      liveLink
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Get All Products**
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **Get Product by ID**
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
    const { name, category, description, price, liveLink, images } = req.body;

    let imageUrls = [];

    // Upload new images if provided
    if (images && images.length > 0) {
      const uploadPromises = images.map((image) => cloudinary.uploader.upload(image, { folder: "products" }));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, images: imageUrls, description, price, liveLink, updatedAt: Date.now() },
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

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
