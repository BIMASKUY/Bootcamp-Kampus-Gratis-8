export interface IFormattedDailyActiveUser {
    date: string;
    total: number;
    users: {
        email: string;
        name: string;
        role: string;
    }[];
}