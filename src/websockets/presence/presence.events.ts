import { Server, Socket } from "socket.io"
import { findUserById } from '../../modules/user/user.service'
import { User } from "@prisma/client";

const onlineUsers = new Set<string>();

async function getUserData(userIdArray: string[]): Promise<Partial<User>[]> {
    const userArray: Partial<User>[] = []
    
    for (let c = 0; c < userIdArray.length; c++) {
        const user = await findUserById(userIdArray[c])
        if (!user) continue
        userArray.push({
            id: user.id,
            name: user.name,
            displayName: user.displayName,
            avatar: user.avatar
        })
    }
    
    return userArray;
}

export async function registerPresenceEvents(server: Server, socket: Socket) {
    socket.on('presence:sync', () => {
        socket.emit('presence:sync', { onlineUsers: Array.from(onlineUsers) })
    })
}

export async function onConnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()
    
    if (sockets.length <= 1) {
        onlineUsers.add(userId)
        const user = await findUserById(userId)
        server.to('channel:global').emit('presence:online', user)
    }
    
    const userData = await getUserData(Array.from(onlineUsers))
    socket.emit('presence:sync', { onlineUsers: userData })
}

export async function onDisconnectPresence(server: Server, socket: Socket) {
    const userId = socket.data.userId

    const sockets = await server.in(`user:${userId}`).fetchSockets()

    if (sockets.length === 0) {
        onlineUsers.delete(userId);
        server.to('channel:global').emit('presence:offline', { userId })
    }
}
