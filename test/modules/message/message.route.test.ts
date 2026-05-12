import { test, expect } from "vitest";
import app from "../../../src/app";
import prisma from "../../../src/utils/prisma";
import { createUser, deleteUser } from "../user/user.route.test";

function createMessage(id?: string) {
    return prisma.message.create({
        data: {
            content: `Insane message`,
            authorId: id ? id : global.authorId
        }
    })
}

function deleteMessage(id: string) {
    return prisma.message.delete({
        where: { id }
    })
}

test('GET /messages - should return list of messages when authenticated', async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/messages",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body).message;
    expect(Array.isArray(responseBody)).toBe(true);
});

test("GET /messages - should return 401 if not authenticated", async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/messages",
    });

    expect(response.statusCode).toBe(401);
});

test("GET /messages/:id - should return message info by a certain id when authenticated", async () => {
    const tempMessage = await createMessage();
    const messageId = tempMessage.id;

    const response = await app.inject({
        method: "GET",
        url: `/api/messages/${messageId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body).message;
    expect(responseBody).toHaveProperty("id", messageId);
    expect(responseBody).toHaveProperty("content");
    expect(responseBody).toHaveProperty("responseId");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");

    await deleteMessage(messageId);
});

test("GET /messages/:id - should return 401 if not authenticated", async () => {
    const response = await app.inject({
        method: "GET",
        url: "/api/messages/some-random-message-id",
    });

    expect(response.statusCode).toBe(401);
});

test("POST /messages - should create a new message without responseId", async () => {
    const newMessage = {
        content: "nice message"
    }

    const response = await app.inject({
        method: "POST",
        url: "/api/messages",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: newMessage
    })

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body).message;
    expect(responseBody).toHaveProperty("id");
    expect(responseBody).toHaveProperty("responseId");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody.content).toBe(newMessage.content);
});

test("POST /messages should create a message with a valid responseId", async () => {
    const message = await createMessage()
    
    const newMessage = {
        content: "nice message 2",
        responseId: message.id
    }

    const response = await app.inject({
        method: "POST",
        url: "/api/messages",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: newMessage
    })

    console.log(response.body)

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.body).message;
    expect(responseBody).toHaveProperty("id");
    expect(responseBody).toHaveProperty("createdAt");
    expect(responseBody).toHaveProperty("updatedAt");
    expect(responseBody.content).toBe(newMessage.content);
    expect(responseBody.responseId).toBe(newMessage.responseId);

    await deleteMessage(message.id)
})

test("POST /messages - should return 400 for invalid input", async () => {
    const invalidMessage = {
        content: ""
    }

    const response = await app.inject({
        method: "POST",
        url: "/api/messages",
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: invalidMessage
    })

    expect(response.statusCode).toBe(400);
});

test("PATCH /messages/:id - should update message content when authenticated", async () => {
    const createdMessage = await createMessage();
    const messageId = createdMessage.id;

    const updatedData = {
        content: "new content",
    };

    const response = await app.inject({
        method: "PATCH",
        url: `/api/messages/${messageId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: updatedData,
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body).message;
    expect(responseBody).toHaveProperty("id", messageId);
    expect(responseBody).toHaveProperty("content", updatedData.content);

    await deleteMessage(messageId)
});

test("PATCH /messages/:id - should return 403 when trying to update another user's message", async () => {  
    const tempUser = await createUser()

    const createdMessage = await createMessage(tempUser.id);
    const messageId = createdMessage.id;

    const updatedData = {
        content: "not my message",
    };

    const response = await app.inject({
        method: "PATCH",
        url: `/api/users/${messageId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
        payload: updatedData,
    });

    expect(response.statusCode).toBe(403);

    await deleteMessage(messageId);
    await deleteUser(tempUser.id)
});

test("DELETE /messages/:id - should delete message when authenticated", async () => {    
    const createdMessage = await createMessage();
    const messageId = createdMessage.id;

    const response = await app.inject({
        method: "DELETE",
        url: `/api/messages/${messageId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty("message", "Message deleted successfully");
});

test("DELETE /messages/:id - should return 403 when trying to delete another user's message", async () => {
    const tempUser = await createUser()
    const createdMessage = await createMessage(tempUser.id)
    const messageId = createdMessage.id;

    const response = await app.inject({
        method: "DELETE",
        url: `/api/messages/${messageId}`,
        headers: {
            Authorization: `Bearer ${global.token}`,
        },
    });

    expect(response.statusCode).toBe(403);

    await deleteMessage(messageId)
    await deleteUser(tempUser.id)
});
