import {
  arrayElement,
  boolElement,
  cuidParam,
  NotFound,
  numberElement,
  objectElement,
  reference,
  security,
  stringElement,
} from '../../utils/docs';

const ChannelId = cuidParam('Channel');

export const channelDocs = {
  createChannel: {
    tags: ['Channels'],
    summary: 'Create a new channel',
    description: 'Creates a new channel with the provided details.',
    security,
    body: objectElement(
      {
        recipientId: stringElement('cmhc8ydab0000qsblnb4nhk8a', {
          description: 'Id of the recipient user',
        }),
      },
      { description: 'Channel creation payload' },
    ),
    response: {
      201: objectElement({
        channel: objectElement(undefined, reference('ChannelDM')),
      }),
      400: objectElement({
        message: stringElement('Invalid channel data'),
      }),
    },
  },

  createGroup: {
    tags: ['Channels'],
    summary: 'Create a new group channel',
    description: 'Creates a new group channel with multiple recipients.',
    security,
    body: objectElement(
      {
        recipients: arrayElement(stringElement('cmhc8ydab0000qsblnb4nhk8a'), {
          description: 'Array of recipient user Ids',
        }),
      },
      { description: 'Group channel creation payload' },
    ),
    response: {
      201: objectElement({
        channel: objectElement(undefined, reference('ChannelGroup')),
      }),
      400: objectElement({
        message: stringElement('Invalid group channel data'),
      }),
    },
  },

  getChannelById: {
    tags: ['Channels'],
    summary: 'Get a channel by its ID',
    description: 'Retrieves a channel using its unique identifier.',
    security,
    params: ChannelId,
    response: {
      200: objectElement({
        channel: objectElement(undefined, reference('ChannelDM')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getDmById: {
    tags: ['Channels'],
    summary: 'Get a direct message channel by its ID',
    description: 'Retrieves a direct message channel using its unique identifier.',
    security,
    params: ChannelId,
    response: {
      200: objectElement({
        channel: objectElement(undefined, reference('ChannelDM')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  updateChannel: {
    tags: ['Channels'],
    summary: 'Update a channel by its ID',
    description: 'Updates the details of a channel using its unique identifier.',
    security,
    params: ChannelId,
    body: objectElement(
      {
        name: stringElement('New Channel Name', {
          minLength: 1,
          maxLength: 30,
          description: 'New name for the channel - Used in both server and groups',
        }),
        icon: stringElement('cmhc8ydab0000qsblnb4nhk8a', {
          description: 'CUID of the new icon - Used in groups updating',
          nullable: true,
        }),
        parentId: stringElement('cmhc8ydab0000qsblnb4nhk8a', {
          description: 'CUID of the new parent channel - Used in server updating',
          nullable: true,
        }),
      },
      { description: 'Channel update payload' },
    ),
    response: {
      200: objectElement({
        channel: objectElement(undefined, reference('ChannelGroup')),
      }),
      400: objectElement({
        message: stringElement('Invalid channel update data'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  deleteChannel: {
    tags: ['Channels'],
    summary: 'Delete a channel by its ID',
    description: 'Deletes a channel using its unique identifier.',
    security,
    params: ChannelId,
    response: {
      200: objectElement({
        message: stringElement('Channel deleted successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  createChannelMembers: {
    tags: ['Channels'],
    summary: 'Add members to a channel',
    description: 'Adds one or more members to the specified channel.',
    security,
    params: ChannelId,
    body: objectElement(
      {
        memberIds: arrayElement(stringElement('cmhc8ydab0000qsblnb4nhk8a'), {
          description: 'Array of member user Ids to add to the channel',
          minItems: 1,
        }),
      },
      { description: 'Channel members addition payload' },
    ),
    response: {
      200: objectElement({
        message: stringElement('Members added successfully'),
      }),
      400: objectElement({
        message: stringElement('Invalid member Ids'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  deleteChannelMember: {
    tags: ['Channels'],
    summary: 'Remove a member from a channel',
    description: 'Removes a specified member from the channel.',
    security,
    params: cuidParam('ChannelMember'),
    response: {
      200: objectElement({
        message: stringElement('Member removed successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getActiveChannels: {
    tags: ['Channels'],
    summary: 'Get active channels for the user',
    description:
      'Returns a list of channels that the authenticated user is actively participating in.',
    security,
    response: {
      200: objectElement({
        channels: arrayElement(reference('ChannelDM')),
      }),
    },
  },

  activateChannel: {
    tags: ['Channels'],
    summary: 'Activate a channel',
    description: 'Activates the specified channel for the authenticated user.',
    security,
    params: ChannelId,
    response: {
      200: objectElement({
        message: stringElement('Channel activated successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  deactivateChannel: {
    tags: ['Channels'],
    summary: 'Deactivate a channel',
    description: 'Deactivates the specified channel for the authenticated user.',
    security,
    params: ChannelId,
    response: {
      200: objectElement({
        message: stringElement('Channel deactivated successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getChannelMessages: {
    tags: ['Channels'],
    summary: 'Get messages for a channel',
    description:
      'Retrieves messages from the specified channel with optional pagination and ordering.',
    security,
    params: ChannelId,
    querystring: objectElement({
      limit: numberElement(20, { description: 'Number of messages to retrieve' }),
      before: stringElement('2025-10-29T15:00:00.000Z', {
        description: 'Fetch messages sent before this date or message ID',
      }),
      after: stringElement('cmhcbfs0i0001qsebq6e0bw6a', {
        description: 'Fetch messages sent after this date or message ID',
      }),
      order: stringElement('desc', {
        description: 'Order of messages',
        enum: ['asc', 'desc'],
      }),
    }),
    response: {
      200: objectElement({
        messages: arrayElement(reference('Message')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  createMessage: {
    tags: ['Channels'],
    summary: 'Create a message in a channel',
    description: 'Sends a new message to the specified channel.',
    security,
    params: ChannelId,
    body: objectElement(
      {
        content: stringElement('Hello, world!', {
          minLength: 1,
          maxLength: 2000,
          description: 'Content of the message',
        }),
        replies: arrayElement(stringElement('cmhc8ydab0000qsblnb4nhk8a'), {
          description: 'Array of message Ids being replied to',
          maxItems: 5,
        }),
        attachments: arrayElement(stringElement('cmhc8ydab0000qsblnb4nhk8a'), {
          description: 'Array of attachment Ids',
          maxItems: 10,
        }),
        silent: boolElement(false, {
          description: 'Whether the message is sent silently',
        }),
        private: boolElement(false, {
          description: 'Whether the message is private',
        }),
      },
      { description: 'Message creation payload' },
    ),
    response: {
      201: objectElement({
        message: objectElement(undefined, reference('Message')),
      }),
      400: objectElement({
        message: stringElement('Invalid message data'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },
};
