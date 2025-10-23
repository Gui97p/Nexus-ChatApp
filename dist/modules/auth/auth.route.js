"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = registerAuthRoutes;
const auth_controller_1 = require("./auth.controller");
const zodValidate_1 = __importDefault(require("../../utils/zodValidate"));
const auth_schema_1 = require("./auth.schema");
async function registerAuthRoutes(app) {
    app.post("/", { preHandler: (0, zodValidate_1.default)(auth_schema_1.authSchema) }, auth_controller_1.authHandler);
}
