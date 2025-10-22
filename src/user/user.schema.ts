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

export const createUserResponseSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(3).max(64),
    displayName: z.string().min(3).max(64).optional(),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
