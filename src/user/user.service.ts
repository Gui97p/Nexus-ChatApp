import prisma from "../utils/prisma";
import { CreateUserInput } from "./user.schema";
import bcrypt from 'bcrypt';

export function findUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export async function createUser(data: CreateUserInput) {
    const { name, email, password } = data;
    const hash = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            name,
            email,
            password: hash,
        },
    });
}

