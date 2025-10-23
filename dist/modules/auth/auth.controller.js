"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandler = authHandler;
const user_service_1 = require("../user/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const __1 = require("../..");
async function authHandler(req, res) {
    const { email, password } = req.body;
    const user = await (0, user_service_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Invalid email or password" });
    }
    return __1.app.jwt.sign({ userId: user.id }, (err, token) => {
        if (err) {
            return res.status(500).send({ message: "Could not generate token" });
        }
        return res.send({ token });
    });
}
