import { z } from "zod";

function stringCheck(name: string) {
    return z.string({
        required_error: `${name} is required`,
        invalid_type_error: `${name} must be a string`,
    });
}

export const createUserSchema = z.object({
    name: stringCheck('Name').min(3).max(64),
    email: stringCheck('Email').email({
        message: "Invalid email address",
    }),
    password: z.string(stringCheck('Password')).min(8, 'Password must have 8 or more letters').max(128, 'Password must have 128 or less letters'),
})

export const updateUserSchema = z.object({
    name: stringCheck('Name').min(3).max(16),
    displayName: stringCheck('Display Name').min(1).max(32),
    email: stringCheck('Email').email({
        message: "Invalid email address",
    }),
    avatar: stringCheck('Avatar').url(),
}).partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;