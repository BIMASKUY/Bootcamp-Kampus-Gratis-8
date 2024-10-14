import express from 'express';
import dotenv from 'dotenv';
import { userRoutes }  from './routes/user.route';
import { articleRoutes } from './routes/article.route';
import { commentRoutes } from './routes/comment.route';
import { logger } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { databaseConnection } from './databases/db.database';

const app = express();

dotenv.config();
databaseConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use(errorHandler);

export default app;