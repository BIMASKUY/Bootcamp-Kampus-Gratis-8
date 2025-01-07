import { IDailyActiveUsers, DailyActiveUsers } from '../models/daily.model';
import { Types } from 'mongoose';
import { formatDailyActiveUsers } from '../utils/daily.util';
import { IFormattedDailyActiveUser } from '../interface/daily.interface';

export const updateDailyActiveUsers = async (userId: Types.ObjectId): Promise<void> => {
  const currentDate = new Date();
  const dateOnly = new Date(currentDate.toISOString().split('T')[0]); // Hanya tanggal (YYYY-MM-DD)

  await DailyActiveUsers.findOneAndUpdate(
    { 
      date: dateOnly 
    },
    { 
      $addToSet: { 
        users: userId 
      }
    },
    { 
      upsert: true, 
    }
  );
}

export const getAllDailyActiveUsers = async (): Promise<IFormattedDailyActiveUser[]> => {
  const dailyActiveUsers: IDailyActiveUsers[] = await DailyActiveUsers.find().populate('users', 'name email role -_id');
  const formattedDailyActiveUsers: IFormattedDailyActiveUser[] = formatDailyActiveUsers(dailyActiveUsers);

  return formattedDailyActiveUsers;
}

export const getDailyActiveUsersByDate = async (date: Date): Promise<IFormattedDailyActiveUser | null> => {
  const dateOnly = new Date(date.toISOString().split('T')[0]);
  const dailyActiveUsers: IDailyActiveUsers | null = await DailyActiveUsers
    .findOne({ date: dateOnly })
    .populate('users', 'name email role -_id');

  if (!dailyActiveUsers) return null;

  const formattedDailyActiveUser: IFormattedDailyActiveUser = formatDailyActiveUsers([dailyActiveUsers])[0];
  return formattedDailyActiveUser;
}