import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { ResponseError } from '../error/response.error';
import { IUserRequest } from '../interface/user.interface';
import { getPayload, decodeJwt } from '../auth/jwt.auth';
import { Types } from 'mongoose';
import { forgetPassword } from '../services/email.service';
import { storeSession, invalidSession } from '../services/session.service'

import { 
  UserType,
  LoginUserType,
  UpdateUserType,
  ForgetUserType,
  ResetUserType,
  validateInputUserSchema,
  validateInputLoginUserSchema,
  validateInputUpdateUserSchema,
  validateInputForgetUserSchema,
  validateInputResetUserSchema
} from '../schema/user.schema';

import { 
  createUser,
  isValidPassword,
  getUserByEmail,
  updateUser,
  getUserById,
  stringToObjectId,
  resetPassword,
} from '../services/user.service';

export const create = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const data: UserType = validateInputUserSchema(req.body);
    const findUser: IUser | null = await getUserByEmail(data.email);
    if (findUser) throw new ResponseError(409, 'Email sudah digunakan');

    const user: IUser = await createUser(req.body);

    res.status(201).json({
      success: true,
      data: {
        email: user.email,
        name: user.name
      },
      message: 'User berhasil terdaftar'
    });
  } catch (e) {
    next(e);
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const data: LoginUserType = validateInputLoginUserSchema(req.body);

    const user: IUser | null = await getUserByEmail(data.email);
    if (!user) throw new ResponseError(404, 'Email tidak terdaftar');

    const isValid: boolean = await isValidPassword(data.password, user.password);
    if (!isValid) throw new ResponseError(401, 'Password salah');

    const token: string = await getPayload(user);
    const success: boolean = await storeSession(token);
    if (!success) throw new ResponseError(500, 'Token tidak tersimpan')

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token
      }
    });
    
  } catch (e) {
    next(e);
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const userReq: IUserRequest = req as IUserRequest;
    const data: UpdateUserType = validateInputUpdateUserSchema(req.body);
    const user: IUser | null = await updateUser(data, userReq.userId);
    if (!user) throw new ResponseError(404, 'User tidak ditemukan');

    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        name: user.name
      },
      message: 'User berhasil diperbarui'
    });
  } catch (e) {
    next(e);
  }
}

export const get = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const id: Types.ObjectId | null = stringToObjectId(req.params.id);
    if(!id) throw new ResponseError(400, 'Id user tidak valid');

    const user: IUser | null = await getUserById(id);
    if (!user) throw new ResponseError(404, 'User tidak ditemukan');

    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        name: user.name
      },
      message: 'User berhasil didapatkan'
    });
  } catch (e) {
    next(e);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {

  const { authorization } = req.headers!;
  if (!authorization) throw new ResponseError(401, 'Unauthorized');

  const token: string = authorization.split(' ')[1];
  const success: boolean = await invalidSession(token);
  if (!success) throw new ResponseError(500, 'Gagal logout');

  try {
    res.status(200).json({
      success: true,
      message: 'Logout berhasil',
      data: {}
    });
  } catch (e) {
    next(e);
  }
}

export const forget = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const data: ForgetUserType = validateInputForgetUserSchema(req.body);
    const user: IUser | null = await getUserByEmail(data.email);
    if (!user) throw new ResponseError(404, 'Email tidak terdaftar');

    const token: string = await getPayload(user);
    const success: boolean = await forgetPassword(user.email, token);
    if (!success) throw new ResponseError(500, 'Gagal mengirim email');

    res.status(200).json({
      success: true,
      message: 'Reset password telah dikirim ke email anda',
      data: {
        email: user.email
      }
    });
  } catch (e) {
    next(e);
  }
}

export const reset = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const data: ResetUserType = validateInputResetUserSchema(req.body);
    const token: string = req.query.token as string;
    const jwt = decodeJwt(token);
    const user: IUser | null = await resetPassword(data.password, jwt.id);
    if (!user) throw new ResponseError(404, 'User tidak ditemukan');

    res.status(200).json({
      success: true,
      message: 'Reset password berhasil',
      data: {
        email: user.email
      }
    });
  } catch (e) {
    next(e);
  }
}