import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUserRequest extends Request {
    userId: Types.ObjectId;
}



// export interface IUserData {
//     id: string;
//     email: string;
//     name: string;
// }