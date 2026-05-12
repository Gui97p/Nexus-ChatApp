import { test, expect } from "vitest";
import app from "../../../src/app";
import prisma from "../../../src/utils/prisma";
import { randomUUID } from "crypto";

export function createUser() {
    const uuid = randomUUID()
    return prisma.user.create({
        data: {
            name: `User_${uuid}`,
            email: `${uuid}@email.com`,
            password: uuid
        }
    })
}

export function deleteUser(id: string) {
    return prisma.user.delete({
        where: { id }
    })
}

test('GET /users - should return list of users when authenticated', async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(Array.isArray(responseBody)).toBe(true);
});

test("GET /users - should return 401 if not authenticated", async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/users",
    });

    expect(response.statusCode).toBe(401);
});

test("GET /users/:id - should return user info by a certain id when authenticated", async () => {
    const usersResponse = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    const users = JSON.parse(usersResponse.body);
    const userId = users[0].id;

    const response = await app.inject({
        method: "GET",
        url: `/api/users/${userId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("id", userId);
    expect(responseBody).toHaveProperty("email");
    expect(responseBody).toHaveProperty("name");
    expect(responseBody).toHaveProperty("avatar");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody).toHaveProperty("displayName");
});

test("GET /users/:id - should return 401 if not authenticated", async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/users/some-random-user-id",
    });

    expect(response.statusCode).toBe(401);
});

test("GET /users/me - should return current user info when authenticated", async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/users/me",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("id");
    expect(responseBody).toHaveProperty("email");
    expect(responseBody).toHaveProperty("name");
    expect(responseBody).toHaveProperty("avatar");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody).toHaveProperty("displayName");
});

test('GET /users/me - should return 401 if not authenticated', async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/users/me",
    });

    expect(response.statusCode).toBe(401);
});

test("POST /users - should create a new user", async () => {
    const newUser = {
        name: "testuser",
        email: "teste123@email.com",
        password: "password123"
    }

    const response = await app.inject({
        method: "POST",
        url: "/api/users",
        payload: newUser
    })

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("id");
    expect(responseBody).toHaveProperty("avatar");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody).toHaveProperty("displayName");
    expect(responseBody.name).toBe(newUser.name);
    expect(responseBody.email).toBe(newUser.email);
});

test("POST /users - should return 400 for invalid input", async () => {
    const invalidUser = {
        name: "tu",
        email: "invalid-email",
        password: "123"
    }

    const response = await app.inject({
        method: "POST",
        url: "/api/users",
        payload: invalidUser
    })

    expect(response.statusCode).toBe(400);
});

test("PATCH /users/:id - should update user info when authenticated", async () => {
    const createdUser = await createUser();
    const userId = createdUser.id;

    const updatedData = {
        name: "updatedName",
    };

    const token = app.jwt.sign({ userId });

    const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        payload: updatedData,
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("id", userId);
    expect(responseBody).toHaveProperty("name", updatedData.name);

    await deleteUser(userId)
});

test("PATCH /users/:id - should return 403 when trying to update another user", async () => {    
    const createdUser = await createUser();
    const userId = createdUser.id;

    const updatedData = {
        name: "hackerName",
    };

    const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${userId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: updatedData,
    });

    expect(response.statusCode).toBe(403);

    await deleteUser(userId);
});

test("DELETE /users/:id - should delete user when authenticated", async () => {    
    const createdUser = await createUser();
    const userId = createdUser.id;
    const token = app.jwt.sign({ userId });

    const response = await app.inject({
        method: "DELETE",
        url: `/api/users/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("message", "User deleted successfully");
});

test("DELETE /users/:id - should return 403 when trying to delete another user", async () => {
    const createdUser = await createUser()
    const userId = createdUser.id;

    const response = await app.inject({
        method: "DELETE",
        url: `/api/users/${userId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(403);

    await deleteUser(userId)
});
