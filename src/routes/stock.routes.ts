import { Router } from 'express';
import { stockController } from '../controllers/stock.controller';

const router = Router();

router.post('/in', stockController.stockIn);
router.post('/out', stockController.stockOut);
router.post('/move', stockController.moveStock);
router.get('/history/:id', stockController.getHistory);

export const stockRoutes = router;