"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersHandler = getUsersHandler;
exports.getUserHandler = getUserHandler;
exports.createUserHandler = createUserHandler;
exports.updateUserHandler = updateUserHandler;
exports.deleteUserHandler = deleteUserHandler;
const user_service_1 = require("./user.service");
async function getUsersHandler() {
    return await (0, user_service_1.findUsers)();
}
async function getUserHandler(req, res) {
    const { id } = req.params;
    console.log(req.user.userId);
    const user = await (0, user_service_1.findUserById)(id);
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.send(userWithoutPassword);
}
async function createUserHandler(req, res) {
    const body = req.body;
    const user = await (0, user_service_1.createUser)(body);
    const { password, ...userWithoutPassword } = user;
    return res.status(201).send(userWithoutPassword);
}
async function updateUserHandler(req, res) {
    const { id } = req.params;
    const body = req.body;
    const userId = req.user.userId;
    if (userId !== id) {
        return res.status(403).send({ message: "You can only update your own account" });
    }
    try {
        const updatedUser = await (0, user_service_1.updateUser)(id, body);
        const { password, ...userWithoutPassword } = updatedUser;
        return res.send(userWithoutPassword);
    }
    catch (error) {
        return res.status(404).send({ message: "User not found" });
    }
}
async function deleteUserHandler(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    if (userId !== id) {
        return res.status(403).send({ message: "You can only delete your own account" });
    }
    try {
        await (0, user_service_1.deleteUser)(id);
        return res.status(200).send({ message: "User deleted successfully" });
    }
    catch (error) {
        return res.status(404).send({ message: "User not found" });
    }
}
