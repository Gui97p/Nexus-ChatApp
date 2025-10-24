import prisma from "../../utils/prisma";

export function getMessages(quantity?: number, offset?: number) {
    return prisma.message.findMany({
        take: quantity,
        skip: offset || 0,
        orderBy: { createdAt: 'desc' }
    });
}

export function getMessagesByAuthor(userId: string, quantity?: number, offset?: number) {
    return prisma.message.findMany({
        where: { authorId: userId },
        take: quantity,
        skip: offset || 0,
        orderBy: { createdAt: 'desc' }
    });
}

export function getMessageById(id: string) {
    return prisma.message.findUnique({
        where: { id }
    });
}

export function createMessage(data: { content: string; responseId?: string; authorId: string }) {
    return prisma.message.create({
        data
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
