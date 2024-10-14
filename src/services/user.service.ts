import bcrypt from 'bcrypt';
import { IUser, User } from '../models/user.model';
import { Types } from 'mongoose';
import { UpdateUserType } from '../schema/user.schema';

export const createUser = async (data: IUser): Promise<IUser> => {
  const hashPassword: string = await bcrypt.hash(data.password, 10);
  data.password = hashPassword;
  const user: IUser = await User.create(data);

  return user;
}

export const isValidPassword = async (userPassword: string, inputPassword: string): Promise<boolean> => {
  const isValidPassword = await bcrypt.compare(userPassword, inputPassword);
  return isValidPassword;
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user: IUser | null = await User.findOne({
    email
  });

  return user;
}

export const getUserById = async (id: Types.ObjectId): Promise<IUser | null> => {
  const user: IUser | null = await User.findById(id);
  return user;
}

export const stringToObjectId = (id: string): Types.ObjectId | null => {
  if (!Types.ObjectId.isValid(id)) return null;

  const objectId = new Types.ObjectId(id);
  return objectId
}

export const updateUser = async (data: UpdateUserType, id: Types.ObjectId): Promise<IUser | null> => {
  const user: IUser | null = await getUserById(id);
  if (!user) return null;

  if (data.name) user.name = data.name;
  if (data.password) user.password = await bcrypt.hash(data.password, 10);
  
  const updatedUser: IUser | null = await User.findByIdAndUpdate(
    id, 
    {
      name: user.name,
      password: user.password
    },
    { 
      new: true,
      runValidators: true
    }
  );

  return updatedUser;
}

export const resetPassword = async (newPassword: string, id: Types.ObjectId): Promise<IUser | null> => {
  const user: IUser | null = await getUserById(id);
  if (!user) return null;

  user.password = await bcrypt.hash(newPassword, 10);
  
  const updatedUser: IUser | null = await User.findByIdAndUpdate(
    id, 
    {
      password: user.password
    },
    { 
      new: true,
      runValidators: true
    }
  );

  return updatedUser;
}