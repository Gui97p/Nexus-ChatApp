"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserRoutes = registerUserRoutes;
const user_controller_1 = require("./user.controller");
const zodValidate_1 = __importDefault(require("../../utils/zodValidate"));
const user_schema_1 = require("./user.schema");
const auth_1 = __importDefault(require("../../utils/auth"));
async function registerUserRoutes(app) {
    app.get("/", { preHandler: auth_1.default }, user_controller_1.getUsersHandler);
    app.get('/:id', { preHandler: auth_1.default }, user_controller_1.getUserHandler);
    app.post("/", { preHandler: (0, zodValidate_1.default)(user_schema_1.createUserSchema) }, user_controller_1.createUserHandler);
    app.patch('/:id', { preHandler: auth_1.default }, user_controller_1.updateUserHandler);
    app.delete('/:id', { preHandler: auth_1.default }, user_controller_1.deleteUserHandler);
}
