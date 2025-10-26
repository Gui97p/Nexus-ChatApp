import { Server, Socket } from "socket.io"

const onlineUsers = new Set<string>();

export async function registerPresenceEvents(server: Server, socket: Socket) {
    
}

export async function onConnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()

    if (sockets.length <= 1) {
        onlineUsers.add(userId)
        server.to('channel:global').emit('presence:online', { userId })
    }

    socket.emit('presence:sync', { onlineUsers: Array.from(onlineUsers) })
}

export async function onDisconnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()

    if (sockets.length === 0) {
        onlineUsers.delete(userId);
        server.to('channel:global').emit('presence:offline', { userId })
    }
}
