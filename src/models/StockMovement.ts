import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Entrada', 'Saída', 'Transferência'],
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  notes: String,
  fromLocation: {
    aisle: String,
    shelf: String,
    bin: String
  },
  toLocation: {
    aisle: String,
    shelf: String,
    bin: String
  }
}, {
  timestamps: true
});

export const StockMovement = mongoose.model('StockMovement', stockMovementSchema);