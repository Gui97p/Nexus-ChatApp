import { z } from 'zod';

const content = z.string().min(1, "Content cannot be empty").max(2000, 'Content cannot exceed 2000 characters')

export const CreateMessageSchema = z.object({
    content,
    replies: z.array(z.string().cuid()).optional(),
    silent: z.boolean().optional(),
    private: z.boolean().optional()
}).superRefine((data, ctx) => {
    if (!data.replies || data.replies.length === 0) {
        if (data.private === true) ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A message can't be private when there's no replies",
            path: [ 'private' ]
        });
        if (data.silent === true) ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A message can't be silent when there's no replies",
            path: [ 'silent' ]
        });
    }
})

export const UpdateMessageSchema = z.object({
    content
})

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;
