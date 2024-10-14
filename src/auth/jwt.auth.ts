import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const getPayload = async (data: IUser): Promise<string> => {
    const payload: JwtPayload = { 
      id: data._id,
    };

    const expiresIn: number = 60 * 60 * 1 // 1 jam;
    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET di .env masih kosong');

    const token: string = jwt.sign(payload, secret, { expiresIn: expiresIn });
    return token;
}

export const decodeJwt = (token: string): JwtPayload => {
    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET di .env masih kosong');

    const jwtDecode: string | JwtPayload = jwt.verify(token, secret);
    if (typeof jwtDecode === 'string') throw new Error('Tipe data jwt adalah object bukan string');
    
    return jwtDecode;
}