import { Router } from 'express';
import { isLogin } from '../middlewares/auth.middleware';

import { 
    create,
    deletes,
    get
} from '../controllers/bookmark.controller';

const bookmarkRoutes = Router();

bookmarkRoutes.get('/', isLogin, get);
bookmarkRoutes.post('/:articleId', isLogin, create);
bookmarkRoutes.delete('/:articleId', isLogin, deletes);

export { bookmarkRoutes };