import { Server, Socket } from "socket.io";

export function registerMessageEvents(server: Server, socket: Socket) {

}

export function onConnectMessage(server: Server, socket: Socket) {
    socket.join('channel:global');
}

export function onDisconnectMessage(server: Server, socket: Socket) {
    socket.leave('channel:global');
}