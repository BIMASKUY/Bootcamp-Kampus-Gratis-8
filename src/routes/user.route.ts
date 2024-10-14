import { Router } from 'express';
import { isLogin, isGuest } from '../middlewares/auth.middleware';

import { 
    create,
    login,
    update,
    get,
    logout,
    forget,
    reset
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.post('/', isGuest, create);
userRoutes.post('/login', isGuest, login);
userRoutes.post('/logout', isLogin, logout);
userRoutes.patch('/', isLogin, update);
userRoutes.get('/:id', get);
userRoutes.post('/forget-password', isGuest, forget);
userRoutes.post('/reset-password', isGuest, reset);

export { userRoutes };