"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = require("zod");
function stringCheck(name) {
    return zod_1.z.string({
        required_error: `${name} is required`,
        invalid_type_error: `${name} must be a string`,
    });
}
exports.authSchema = zod_1.z.object({
    email: stringCheck('Email').email({
        message: "Invalid email address",
    }),
    password: zod_1.z.string(stringCheck('Password')),
});
