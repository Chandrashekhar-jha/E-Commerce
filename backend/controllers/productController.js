const Product = require('../model/Product');

const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {

    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }   
};

const getProductById = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);

        if (product) {  
            res.json(product);
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock } = req.body;    
        const image = req.file ? req.file.path : null;

        let imageUrl = null;
        if (image) {
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            imageUrl: imageUrl || 'https://via.placeholder.com/300x300.png?text=Product',
            stock
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};


const updateProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock } = req.body;    
        const image = req.file ? req.file.path : null;
        let imageUrl = null;
        if (image) {
            const result = await cloudinary.uploader.upload(image);
            imageUrl = result.secure_url;
        }
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.imageUrl = imageUrl || product.imageUrl;
            if (stock !== undefined) {
                product.stock = stock;
            }
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const deleteProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({
                message: 'Product removed'
            });
        }
        else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};