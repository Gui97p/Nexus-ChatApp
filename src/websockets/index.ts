import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { registerMessageEvents } from "./message/message.events";
import { setSocketServer } from "../utils/socket";

export async function setupWebSocket(app: FastifyInstance) {
    const server = new Server(app.server, {
        cors: {
            origin: "*",
        },
    });

    server.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication error: Token is required"));
            }

            const decoded = app.jwt.verify<{
                userId: string;
                iat?: number;
                exp?: number;
            }>(token);
            
            if (!decoded) {
                return next(new Error("Authentication error: Invalid token"));
            }

            socket.data.userId = decoded.userId;

            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    server.on("connection", (socket) => {
        console.log(`User connected: ${socket.data.userId}`);
        socket.join(`user:${socket.data.userId}`);

        socket.on("ping", () => {
            socket.emit("pong", { message: "pong" });
        })

        registerMessageEvents(server, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.data.userId}`);
            socket.leave('channel:global');
            socket.leave(`user:${socket.data.userId}`);
        });
    });

    setSocketServer(server);
    app.addHook("onClose", async () => {
        server.close();
    });
}
