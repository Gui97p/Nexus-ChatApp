import { z } from "zod";

function stringCheck() {
    return z.string({
        required_error: `invalid email or password`,
        invalid_type_error: `invalid email or password`,
    });
}

export const authSchema = z.object({
    email: stringCheck().email({
        message: "Invalid email or password",
    }),
    password: z.string(stringCheck())
})

export type AuthInput = z.infer<typeof authSchema>;
