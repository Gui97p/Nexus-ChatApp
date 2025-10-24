import { Server, Socket } from "socket.io";

export function registerMessageEvents(server: Server, socket: Socket) {
    socket.join('channel:global');
}