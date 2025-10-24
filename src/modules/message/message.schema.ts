import { z } from 'zod';

export const CreateMessageSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
    response: z.string().optional(),
})

export const UpdateMessageSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
})

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;
