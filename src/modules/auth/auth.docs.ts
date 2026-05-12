import { objectElement, stringElement } from '../../utils/docs';

export const AuthDocs = {
  login: {
    tags: ['Auth'],
    summary: 'Signs-in a User',
    description: 'Returns an access token by user credentials',
    body: objectElement(
      {
        email: stringElement('example@email.com'),
        password: stringElement('StrongPassword123'),
      },
      {
        required: ['email', 'password'],
      },
    ),
    response: {
      200: objectElement({
        token: stringElement(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWg5aGV0ejIwMDA3cXMzdnloanMxc3ViIiwiaWF0IjoxNzYxNTkwMzUwLCJleHAiOjE3OTMxNDc5NTB9.hM7uSFql-xVdZdAbjOD43Kk1-XxVtaq8_L7QW_4d_go',
        ),
      }),
      401: objectElement({
        message: stringElement('Invalid email or password'),
      }),
    },
  },
};
