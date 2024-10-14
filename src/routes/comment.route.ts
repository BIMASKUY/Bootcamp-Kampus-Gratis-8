import { Router } from 'express';
import { isLogin } from '../middlewares/auth.middleware';

import { 
    create,
    erase,
    likes
} from '../controllers/comment.controller';

const commentRoutes = Router();

commentRoutes.post('/likes/:commentId', isLogin, likes);
commentRoutes.post('/:articleId', isLogin, create);
commentRoutes.delete('/:articleId/:commentId', isLogin, erase);

export { commentRoutes };