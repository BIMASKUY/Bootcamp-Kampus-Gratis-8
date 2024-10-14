import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const forgetPassword = async (email: string, token: string): Promise<boolean>  => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Mengatur ulang kata sandi Bootcamp KG',
            text: 'Klik link berikut: http://localhost:3000/api/users/reset-password?token=' + token
        })

        console.log("reset password sent successfully")
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}