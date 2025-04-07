import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { StockMovement } from '../models/StockMovement';

export const stockController = {
  async stockIn(req: Request, res: Response) {
    try {
      const { productId, quantity, notes } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      product.quantity += quantity;
      await product.save();

      const movement = await StockMovement.create({
        productId,
        type: 'Entrada',
        quantity,
        notes
      });

      return res.status(201).json(movement);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao registrar entrada de estoque' });
    }
  },

  async stockOut(req: Request, res: Response) {
    try {
      const { productId, quantity, notes } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }

      product.quantity -= quantity;
      await product.save();

      const movement = await StockMovement.create({
        productId,
        type: 'Saída',
        quantity,
        notes
      });

      return res.status(201).json(movement);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao registrar saída de estoque' });
    }
  },

  async moveStock(req: Request, res: Response) {
    try {
      const { productId, quantity, fromLocation, toLocation, notes } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const movement = await StockMovement.create({
        productId,
        type: 'Transferência',
        quantity,
        fromLocation,
        toLocation,
        notes
      });

      product.warehouseLocation = toLocation;
      await product.save();

      return res.status(201).json(movement);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao registrar transferência de estoque' });
    }
  },

  async getHistory(req: Request, res: Response) {
    try {
      const movements = await StockMovement.find({ 
        productId: req.params.id 
      }).sort({ createdAt: -1 });
      
      return res.json(movements);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar histórico de movimentações' });
    }
  }
};