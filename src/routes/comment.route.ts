import { Router } from 'express';
import { isLogin } from '../middlewares/auth.middleware';

import { 
    create,
    deletes,
    likes,
    unlikes
} from '../controllers/comment.controller';

const commentRoutes = Router();

commentRoutes.post('/likes/:commentId', isLogin, likes);
commentRoutes.delete('/likes/:commentId', isLogin, unlikes);
commentRoutes.post('/:articleId', isLogin, create);
commentRoutes.delete('/:articleId/:commentId', isLogin, deletes);

export { commentRoutes };