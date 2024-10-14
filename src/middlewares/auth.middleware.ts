import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserRequest } from '../interface/user.interface';
import { ResponseError } from '../error/response.error';
import { getSession } from '../services/session.service';
import { ISession } from '../models/session.model';

export const isLogin = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const validationReq = req as IUserRequest;
      
      const { authorization } = validationReq.headers;
      if (!authorization) throw new ResponseError(401, 'Unauthorized');
  
      const token: string = authorization.split(' ')[1];
      if (!token) throw new ResponseError(401, 'Format token salah');
  
      const secret: string | undefined = process.env.JWT_SECRET;
      if (!secret) throw new ResponseError(500, 'JWT_SECRET di .env masih kosong');
  
      const jwtDecode: string | JwtPayload = jwt.verify(token, secret);
      if (typeof jwtDecode === 'string') throw new ResponseError(500, 'Tipe data jwt adalah object bukan string');
      
      const session: ISession | null = await getSession(token);
      if (!session) throw new ResponseError(401, 'Sesi tidak ditemukan')
      if (session.status === 'expired') throw new ResponseError(403, 'Sesi telah kadaluwarsa')

      validationReq.userId = jwtDecode.id
      if (!validationReq.userId) throw new ResponseError(401, 'userId tidak ditemukan dalam auth');
  
      next();
  
    } catch(e) {
      next(e);
    }
}

export const isGuest = (req: Request, res: Response, next: NextFunction) : void => {
    try {
      const validationReq = req as IUserRequest;
      
      const { authorization } = validationReq.headers;
      if (authorization) throw new ResponseError(403, 'Forbidden');
  
      next();
  
    } catch(e) {
      next(e);
    }
}