import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'products'
const productSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: [String], default: [] },
    category: { type: String, required: true }
}, { timestamps: true });

const ProductModel = mongoose.model(collection, productSchema);

export default ProductModel;