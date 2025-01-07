import { IFormattedDailyActiveUser } from "../interface/daily.interface";
import { IDailyActiveUsers } from "../models/daily.model";

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export const formatDailyActiveUser = (dailyActiveUser: IDailyActiveUsers): IFormattedDailyActiveUser => {
    return {
        date: formatDate(dailyActiveUser.date),
        total: dailyActiveUser.users.length,
        users: dailyActiveUser.users.map(user => {
            return {
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    }
}

export const formatDailyActiveUsers = (dailyActiveUsers: IDailyActiveUsers[]): IFormattedDailyActiveUser[] => {
    return dailyActiveUsers.map(dailyActiveUser => formatDailyActiveUser(dailyActiveUser));
}