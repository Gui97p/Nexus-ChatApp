import prisma from "../../utils/prisma";
import { CreateMessageInput } from "./message.schema";
import { createMessageType } from "./message.types";

const author = {
    select: {
        name: true,
        displayName: true,
        avatar: true
    }
}

const repliedTo = {
    select: {
        id: true
    }
}

export function getMessages(quantity?: number, offset?: number) {
    return prisma.message.findMany({
        take: quantity,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
            author,
            repliedTo
        }
    });
}

export function getMessagesByAuthor(userId: string, quantity?: number, offset?: number) {
    return prisma.message.findMany({
        where: { authorId: userId },
        take: quantity,
        skip: offset || 0,
        orderBy: { createdAt: 'desc' },
        include: {
            author,
            repliedTo
        }
    });
}

export function getMessageById(id: string) {
    return prisma.message.findUnique({
        where: { id },
        include: {
            author,
            repliedTo
        }
    });
}

export function createMessage(data: createMessageType) {
    return prisma.message.create({
        data: {
            content: data.content,
            authorId: data.authorId,
            private: data.private,
            silent: data.silent,

            repliedTo: {
                connect: data.replies
            }
        },
        include: {
            author,
            repliedTo
        }
    });
}

export function updateMessage(id: string, content: string) {
    return prisma.message.update({
        where: { id },
        data: { content }
    })
}

export function deleteMessage(id: string) {
    return prisma.message.delete({
        where: { id }
    });
}
