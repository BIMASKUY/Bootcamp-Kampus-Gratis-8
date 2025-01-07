import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IDailyActiveUsers extends Document {
    date: Date;
    users: IUser[];
}

const dailyActiveUsersSchema = new Schema({
    date: { 
        type: Date, 
        required: true, 
        unique: true 
    },
    users: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
});
  
export const DailyActiveUsers = mongoose.model<IDailyActiveUsers>('DailyActiveUsers', dailyActiveUsersSchema);