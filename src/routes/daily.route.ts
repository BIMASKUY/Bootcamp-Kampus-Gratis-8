import { Router } from 'express';
import { isLogin } from '../middlewares/auth.middleware';
import { get, getByDate } from '../controllers/daily.controller';

const dailyRoutes = Router();
dailyRoutes.get('/', isLogin, get);
dailyRoutes.get('/:date', isLogin, getByDate);

export { dailyRoutes };