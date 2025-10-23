import { FastifyReply, FastifyRequest } from "fastify";
import { AuthInput } from "./auth.schema";
import { findUserByEmail } from "../user/user.service";
import bcrypt from "bcrypt";
import { app } from "../..";

export async function authHandler(req: FastifyRequest, res: FastifyReply) {
    const { email, password } = req.body as AuthInput;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Invalid email or password" });
    }
    
    return app.jwt.sign({ userId: user.id }, (err, token) => {
        if (err) {
            return res.status(500).send({ message: "Could not generate token" });
        }
        return res.send({ token });
    });
}