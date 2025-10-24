import prisma from "../../utils/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.schema";
import bcrypt from 'bcrypt';

export function findUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
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

export function findUserByName(name: string) {
    return prisma.user.findUnique({
        where: {
            name,
        },
    });
}

export function findUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id,
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

export async function updateUser(id: string, data: UpdateUserInput) {
    return prisma.user.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id,
        },
    });
}
