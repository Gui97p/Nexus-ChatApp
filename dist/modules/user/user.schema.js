"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
function stringCheck(name) {
    return zod_1.z.string({
        required_error: `${name} is required`,
        invalid_type_error: `${name} must be a string`,
    });
}
exports.createUserSchema = zod_1.z.object({
    name: stringCheck('Name').min(3).max(64),
    email: stringCheck('Email').email({
        message: "Invalid email address",
    }),
    password: zod_1.z.string(stringCheck('Password')).min(8, 'Password must have 8 or more letters').max(128, 'Password must have 128 or less letters'),
});
exports.updateUserSchema = zod_1.z.object({
    name: stringCheck('Name').min(3).max(16),
    displayName: stringCheck('Display Name').min(3).max(32),
    email: stringCheck('Email').email({
        message: "Invalid email address",
    }),
    avatar: stringCheck('Avatar').url(),
}).partial();
