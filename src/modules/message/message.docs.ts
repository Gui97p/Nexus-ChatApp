import {
  arrayElement,
  boolElement,
  numberElement,
  objectElement,
  reference,
  security,
  stringElement,
} from '../../utils/docs';

const MessageId = objectElement({
  id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Message Id' }),
});
const NotFound = objectElement({
  message: stringElement('Message not found'),
});

export const MessageDocs = {
  getAll: {
    tags: ['Messages'],
    summary: 'Get all messages',
    description: 'Returns paginated messages with cursor or offset support.',
    security,
    querystring: objectElement({
      limit: numberElement(20),
      before: stringElement('2025-10-29T15:00:00.000Z'),
      after: stringElement('cmhcbfs0i0001qsebq6e0bw6a'),
      order: stringElement('desc', { enum: ['asc', 'desc'] }),
    }),
    response: {
      200: objectElement({
        message: arrayElement(reference('Message')),
      }),
    },
  },

  getById: {
    tags: ['Messages'],
    summary: 'Get a message by an Id',
    description: "Returns a unique message based on it's Id",
    security,
    params: MessageId,
    response: {
      200: objectElement({
        message: objectElement(undefined, reference('Message')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  create: {
    tags: ['Messages'],
    summary: 'Creates a new Message',
    description: 'Creates a new Message with all metadata',
    security,
    body: objectElement(
      {
        content: stringElement('Hello world!', { minLength: 1, maxLength: 2000 }),
        private: boolElement(undefined, { default: false }),
        silent: boolElement(undefined, { default: false }),
        replies: arrayElement(stringElement('cmhcas3i00001qsblnb4nhk8o'), { maxItems: 5 }),
      },
      { required: ['content'] },
    ),
    response: {
      201: objectElement(undefined, reference('Message')),
      400: objectElement({
        message: stringElement('No valid messages to reply to', {
          description: 'Occurs when some replies were passed but none of them were valid',
        }),
      }),
    },
  },

  update: {
    tags: ['Messages'],
    summary: 'Updates a Message',
    description: 'Updates a message content',
    security,
    params: MessageId,
    body: objectElement({
      content: stringElement('New Message'),
    }),
    response: {
      200: objectElement({
        message: stringElement('Message updated successfully'),
      }),
      403: objectElement({
        message: stringElement('You must be the author of the message to update it'),
      }),
      404: NotFound,
    },
  },

  delete: {
    tags: ['Messages'],
    summary: 'Deletes a Message',
    description: 'Deletes a Message based on an Id.',
    security,
    params: MessageId,
    response: {
      200: objectElement({
        message: stringElement('Message deleted successfully'),
      }),
      403: objectElement({
        message: stringElement('You must be the author of the message to delete it'),
      }),
      404: NotFound,
    },
  },
};
