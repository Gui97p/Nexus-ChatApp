const UserId = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'User ID', example: 'cmhc8ydab0000qsblnb4nhk8a' },
  },
  required: ['id'],
};

export const UserDocs = {
  getAll: {
    tags: ['Users'],
    summary: 'Get all users',
    description: 'Returns all users.',
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: 'array',
        items: {
          $ref: 'User#',
        },
      },
    },
  },

  getById: {
    tags: ['Users'],
    summary: 'Gets user by Id',
    description: 'Returns an user based on an Id.',
    security: [{ bearerAuth: [] }],
    params: UserId,
    response: {
      200: {
        type: 'object',
        $ref: 'User#',
      },
    },
  },

  getMe: {
    tags: ['Users'],
    summary: 'Gets own user data',
    description: 'Returns own user based on Authorization token.',
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: 'object',
        $ref: 'User#',
      },
    },
  },

  create: {
    tags: ['Users'],
    summary: 'Registers a new User',
    description: 'Creates a new User',
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'John' },
        email: { type: 'string', example: 'example@email.com' },
        password: { type: 'string', example: 'StrongPassword123' },
      },
    },
    response: {
      200: {
        type: 'object',
        $ref: 'User#',
      },
    },
  },

  update: {
    tags: ['Users'],
    summary: 'Updates an User',
    description: 'Updates own User based on an Id',
    security: [{ bearerAuth: [] }],
    params: UserId,
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John' },
        email: { type: 'string', example: 'example@email.com' },
        displayName: { type: 'string', example: 'johnzinhu' },
        avatar: {
          type: 'string',
          example:
            'https://tenor.com/view/monster-versus-vs-alien-monster-vs-alien-gif-16037253809360562033',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User updated successfully' },
        },
      },
    },
  },

  delete: {
    tags: ['Users'],
    summary: 'Deletes an User',
    description: 'Deletes own User based on an Id.',
    security: [{ bearerAuth: [] }],
    params: UserId,
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User deleted successfully' },
        },
      },
    },
  },
};
