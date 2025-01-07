import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { getUserById } from '../services/user.service';
import { IUser } from '../models/user.model';
import { getAllDailyActiveUsers, getDailyActiveUsersByDate } from '../services/daily.service';

export const get = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const userReq: IUserRequest = req as IUserRequest;
    const user: IUser | null = await getUserById(userReq.userId);
    if (!user) throw new ResponseError(404, 'User tidak ditemukan');
    if (user.role !== 'admin') throw new ResponseError(403, 'Forbidden');

    const dailyActiveUsers = await getAllDailyActiveUsers();
    res.status(200).json({
        success: true,
        data: dailyActiveUsers,
        message: 'Semua data login harian pengguna berhasil didapatkan'
    });
  } catch (e) {
    next(e);
  }
}

export const getByDate = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const userReq: IUserRequest = req as IUserRequest;
        const user: IUser | null = await getUserById(userReq.userId);
        if (!user) throw new ResponseError(404, 'User tidak ditemukan');
        if (user.role !== 'admin') throw new ResponseError(403, 'Forbidden');
    
        const date = new Date(req.params.date);
        const dailyActiveUsers = await getDailyActiveUsersByDate(date);
        if (!dailyActiveUsers) throw new ResponseError(404, 'Data login harian tidak ditemukan');
    
        res.status(200).json({
            success: true,
            data: dailyActiveUsers,
            message: 'Data login harian pengguna berhasil didapatkan'
        });
    } catch (e) {
        next(e);
  }
}