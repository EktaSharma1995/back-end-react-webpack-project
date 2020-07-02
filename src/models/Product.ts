import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

export const Product = mongoose.model('Products', productSchema);
