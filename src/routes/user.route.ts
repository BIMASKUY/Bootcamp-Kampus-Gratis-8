import { Router } from 'express';
import { isLogin, isGuest } from '../middlewares/auth.middleware';

import { 
    create,
    login,
    update,
    get,
    logout,
    forget,
    reset,
    duplicate,
    admin,
    getAll
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.post('/', isGuest, create);
userRoutes.post('/login', isGuest, login);
userRoutes.post('/logout', isLogin, logout);
userRoutes.post('/admin', isGuest, admin);
userRoutes.patch('/', isLogin, update);
userRoutes.get('/', isLogin, getAll);
userRoutes.get('/:id', get);
userRoutes.post('/forget-password', isGuest, forget);
userRoutes.post('/reset-password', isGuest, reset);
userRoutes.post('/duplicate-email', duplicate);

export { userRoutes };