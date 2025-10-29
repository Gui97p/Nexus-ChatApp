const MessageId = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Message ID', example: 'cmhc8ydab0000qsblnb4nhk8a' },
  },
  required: ['id'],
};

export const MessageDocs = {
  getAll: {
    tags: ['Messages'],
    summary: 'Get all messages',
    description: 'Returns paginated messages with cursor or offset support.',
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'number', example: 20 },
        before: { type: 'string', example: '2025-10-29T15:00:00.000Z' },
        after: { type: 'string', example: 'cmhcbfs0i0001qsebq6e0bw6a' },
        order: { type: 'string', enum: ['asc', 'desc'], example: 'desc' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'array', items: { $ref: 'Message#' } },
        },
      },
    },
  },

  getByAuthor: {
    tags: ['Messages'],
    summary: 'Get all messages of an Author',
    description: 'Returns paginated messages of an author with cursor or offset support.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'User ID', example: 'cmhc8ydab0000qsblnb4nhk8a' },
      },
      required: ['id'],
    },
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'number', example: 20 },
        before: { type: 'string', example: '2025-10-29T15:00:00.000Z' },
        after: { type: 'string', example: 'cmhcbfs0i0001qsebq6e0bw6a' },
        order: { type: 'string', enum: ['asc', 'desc'], example: 'desc' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'array', items: { $ref: 'Message#' } },
        },
      },
    },
  },

  getById: {
    tags: ['Messages'],
    summary: 'Get a message by an Id',
    description: "Returns a unique message based on it's Id",
    params: MessageId,
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'object', $ref: 'Message#' },
        },
      },
    },
  },

  create: {
    tags: ['Messages'],
    summary: 'Creates a new Message',
    description: 'Creates a new Message with all metadata',
    body: {
      type: 'object',
      required: ['content'],
      properties: {
        content: { type: 'string', minLength: 1, maxLength: 2000, example: 'Hello world!' },
        private: { type: 'boolean', default: false },
        silent: { type: 'boolean', default: false },
        replies: {
          type: 'array',
          items: { type: 'string', example: 'cmhcas3i00001qsblnb4nhk8o' },
          maxItems: 5,
        },
      },
    },
    response: {
      200: {
        type: 'object',
        $ref: 'Message#',
      },
    },
  },

  update: {
    tags: ['Messages'],
    summary: 'Updates a Message',
    description: 'Updates a message content',
    security: [{ bearerAuth: [] }],
    params: MessageId,
    body: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'New Message' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Message updated successfully' },
        },
      },
    },
  },

  delete: {
    tags: ['Users'],
    summary: 'Deletes a Message',
    description: 'Deletes a Message based on an Id.',
    security: [{ bearerAuth: [] }],
    params: MessageId,
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Message deleted successfully' },
        },
      },
    },
  },
};
