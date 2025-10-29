export const AuthDocs = {
  login: {
    tags: ['Auth'],
    summary: 'Signs-in a User',
    description: 'Returns an access token by user credentials',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'example@email.com' },
        password: { type: 'string', example: 'StrongPassword123' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWg5aGV0ejIwMDA3cXMzdnloanMxc3ViIiwiaWF0IjoxNzYxNTkwMzUwLCJleHAiOjE3OTMxNDc5NTB9.hM7uSFql-xVdZdAbjOD43Kk1-XxVtaq8_L7QW_4d_go',
          },
        },
      },
    },
  },
};
