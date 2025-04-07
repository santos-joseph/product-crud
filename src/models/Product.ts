import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  supplier: {
    name: { type: String, required: true },
    contact: { type: String },
    email: { type: String }
  },
  warehouseLocation: {
    aisle: { type: String },
    shelf: { type: String },
    bin: { type: String }
  }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);