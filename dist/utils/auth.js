"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticate;
async function authenticate(req, reply) {
    try {
        await req.jwtVerify();
    }
    catch (err) {
        return reply.code(401).send({ message: "Unauthorized" });
    }
}
