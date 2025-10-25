import { Server, Socket } from "socket.io"

export async function registerPresenceEvents(server: Server, socket: Socket) {
    
}

export async function onConnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()

    if (sockets.length <= 1) {
        server.to('channel:global').emit('presence:online', { userId })
    } else {
        socket.emit('presence:online', { userId })
    }
}

export async function onDisconnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()

    if (sockets.length === 0) {
        server.to('channel:global').emit('presence:offline', { userId })
    }
}
