import { getSocketServer } from '../../utils/socket';

const userStatus: Map<string, string> = new Map();

export function setUserStatus(userId: string, status: string) {
  userStatus.set(userId, status);
}

export function getUserStatus(userId: string): string | undefined {
  return userStatus.get(userId);
}

export function removeUserStatus(userId: string) {
  userStatus.delete(userId);
}

export async function getUserSockets(userId: string) {
  const server = getSocketServer();

  return Array.from(await server.in(`user:${userId}`).fetchSockets());
}
