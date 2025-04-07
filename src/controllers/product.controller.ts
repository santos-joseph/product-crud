import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const productController = {
  async create(req: Request, res: Response) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar produto' });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      return res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover produto' });
    }
  }
};