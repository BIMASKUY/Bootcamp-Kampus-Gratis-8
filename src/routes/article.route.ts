import { Router } from 'express';
import { isLogin } from '../middlewares/auth.middleware';

import { 
    create,
    get,
    likes,
    update,
    deletes
} from '../controllers/article.controller';

const articleRoutes = Router();

articleRoutes.post('/', isLogin, create);
articleRoutes.get('/', get);
articleRoutes.patch('/:articleId', isLogin, update);
articleRoutes.post('/:articleId/likes', isLogin, likes);
articleRoutes.delete('/:articleId', isLogin, deletes);

export { articleRoutes };