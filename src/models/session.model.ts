import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
    token: string;
    status: 'valid' | 'expired';
    expiresAt: Date;
}

const sessionSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['valid', 'expired'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto remove after 1 hour like jwt expires
    }
}, {
    timestamps: true
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);