"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsers = findUsers;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function findUsers() {
    return prisma_1.default.user.findMany({
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
function findUserByEmail(email) {
    return prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
}
function findUserById(id) {
    return prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
}
async function createUser(data) {
    const { name, email, password } = data;
    const hash = await bcrypt_1.default.hash(password, 10);
    return prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hash,
        },
    });
}
async function updateUser(id, data) {
    return prisma_1.default.user.update({
        where: {
            id,
        },
        data,
    });
}
async function deleteUser(id) {
    return prisma_1.default.user.delete({
        where: {
            id,
        },
    });
}
