import request from 'supertest';
import app from '../server';
import { Product } from '../models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

describe('Testes de Produtos', () => {
  let apiKey: string;


  beforeAll(() => {
    apiKey = jwt.sign({}, JWT_SECRET);
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    const produto = await Product.create({
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico RGB',
      sku: 'TECLADO-001',
      category: 'Periféricos',
      price: 199.99,
      quantity: 30,
      supplier: {
        name: 'Tech Supplies',
        contact: '11987654321',
        email: 'contato@tech.com'
      }
    });
  });

  it('deve criar um novo produto', async () => {
    const produto = {
      name: 'Mouse Gamer RGB',
      description: 'Mouse óptico com 7 botões programáveis',
      sku: 'MOUSE-001',
      category: 'Periféricos',
      price: 149.90,
      quantity: 50,
      supplier: {
        name: 'Tech Supplies',
        contact: '11987654321',
        email: 'contato@tech.com'
      }
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `ApiKey ${apiKey}`)
      .send(produto);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(produto.name);
  });

  it('deve listar todos os produtos', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `ApiKey ${apiKey}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve buscar um produto pelo ID', async () => {
    const produto = await Product.create({
      name: 'Produto de Teste',
      description: 'Produto de Teste',
      sku: 'PRODUTO-001',
      category: 'Testes',
      price: 100,
      quantity: 20,
      supplier: {
        name: 'Fornecedor Teste',
        contact: '11987654321',
        email: 'contato@teste.com'
      }
    });

    const response = await request(app)
      .get(`/api/products/${produto._id}`)
      .set('Authorization', `ApiKey ${apiKey}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(produto.name);
  });

  it('deve atualizar um produto', async () => {
    const produto = await Product.create({
      name: 'Produto a ser atualizado',
      description: 'Produto a ser atualizado',
      sku: 'PRODUTO-002',
      category: 'Testes',
      price: 120,
      quantity: 15,
      supplier: {
        name: 'Fornecedor Teste',
        contact: '11987654321',
        email: 'contato@teste.com'
      }
    });

    const updatedData = {
      name: 'Produto Atualizado',
      description: 'Produto atualizado com sucesso',
      price: 150,
      quantity: 10
    };

    const response = await request(app)
      .put(`/api/products/${produto._id}`)
      .set('Authorization', `ApiKey ${apiKey}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  it('deve deletar um produto', async () => {
    const produto = await Product.create({
      name: 'Produto a ser deletado',
      description: 'Produto a ser deletado',
      sku: 'PRODUTO-003',
      category: 'Testes',
      price: 80,
      quantity: 40,
      supplier: {
        name: 'Fornecedor Teste',
        contact: '11987654321',
        email: 'contato@teste.com'
      }
    });

    const response = await request(app)
      .delete(`/api/products/${produto._id}`)
      .set('Authorization', `ApiKey ${apiKey}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Produto removido com sucesso');
  });
});

describe('Testes de Estoque', () => {
  let apiKey: string;

  beforeAll(() => {
    apiKey = jwt.sign({}, JWT_SECRET);
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('deve registrar uma entrada de estoque', async () => {
    const produto = await Product.create({
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico RGB',
      sku: 'TECLADO-001',
      category: 'Periféricos',
      price: 199.99,
      quantity: 30,
      supplier: {
        name: 'Tech Supplies',
        contact: '11987654321',
        email: 'contato@tech.com',
      },
    });

    const response = await request(app)
      .post('/api/stock/in')
      .set('Authorization', `ApiKey ${apiKey}`)
      .send({
        productId: produto._id,
        quantity: 10,
        notes: 'Reposição de estoque',
      });

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(10);
  });

  it('deve registrar uma saída de estoque', async () => {
    const produto = await Product.create({
      name: 'Mouse Gamer RGB',
      description: 'Mouse óptico com 7 botões programáveis',
      sku: 'MOUSE-001',
      category: 'Periféricos',
      price: 149.90,
      quantity: 50,
      supplier: {
        name: 'Tech Supplies',
        contact: '11987654321',
        email: 'contato@tech.com',
      },
    });

    const response = await request(app)
      .post('/api/stock/out')
      .set('Authorization', `ApiKey ${apiKey}`)
      .send({
        productId: produto._id,
        quantity: 5,
        notes: 'Saída de estoque',
      });

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(5);
  });

  it('deve buscar o histórico de movimentações', async () => {
    const produto = await Product.create({
      name: 'Mouse Gamer RGB',
      description: 'Mouse óptico com 7 botões programáveis',
      sku: 'MOUSE-001',
      category: 'Periféricos',
      price: 149.90,
      quantity: 50,
      supplier: {
        name: 'Tech Supplies',
        contact: '11987654321',
        email: 'contato@tech.com',
      },
    });

    await request(app)
      .post('/api/stock/in')
      .set('Authorization', `ApiKey ${apiKey}`)
      .send({
        productId: produto._id,
        quantity: 10,
        notes: 'Entrada de teste',
      });

    await request(app)
      .post('/api/stock/out')
      .set('Authorization', `ApiKey ${apiKey}`)
      .send({
        productId: produto._id,
        quantity: 5,
        notes: 'Saída de teste',
      });

    const response = await request(app)
      .get(`/api/stock/history/${produto._id}`)
      .set('Authorization', `ApiKey ${apiKey}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});