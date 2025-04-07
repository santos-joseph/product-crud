import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB } from './config/database';
import { productRoutes } from './routes/product.routes';
import { stockRoutes } from './routes/stock.routes';
import { authRoutes } from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', authMiddleware);

app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;