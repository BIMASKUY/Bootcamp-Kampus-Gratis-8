import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(100),
    name: z.string().min(3).max(100)
}).strict();

const loginUserSchema = userSchema.pick({ email: true, password: true }); // take email and password only
const updateUserSchema = userSchema.pick({ password: true, name: true }).partial(); // take password and name only, and make it optional
const forgetUserSchema = userSchema.pick({ email: true });
const resetUserSchema = userSchema.pick({ password: true });

export type UserType = z.infer<typeof userSchema>;
export type LoginUserType = z.infer<typeof loginUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type ForgetUserType = z.infer<typeof forgetUserSchema>;
export type ResetUserType = z.infer<typeof resetUserSchema>;

export const validateInputUserSchema = (input: UserType) : UserType => {
    return userSchema.parse(input);
}

export const validateInputLoginUserSchema = (input: LoginUserType) : LoginUserType => {
    return loginUserSchema.parse(input);
}

export const validateInputUpdateUserSchema = (input: UpdateUserType) : UpdateUserType => {
    return updateUserSchema.parse(input);
}

export const validateInputForgetUserSchema = (input: ForgetUserType) : ForgetUserType => {
    return forgetUserSchema.parse(input);
}

export const validateInputResetUserSchema = (input: ResetUserType) : ResetUserType => {
    return resetUserSchema.parse(input);
}