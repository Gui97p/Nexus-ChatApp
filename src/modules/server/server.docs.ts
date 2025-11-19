import {
  objectElement,
  arrayElement,
  stringElement,
  NotFound,
  security,
  reference,
} from '../../utils/docs';

export const serverDocs = {
  getServers: {
    tags: ['Servers'],
    summary: 'Get all servers',
    description: 'Returns all servers available',
    security,
    response: {
      200: objectElement({
        data: arrayElement(reference('Server')),
      }),
    },
  },

  getMyServers: {
    tags: ['Servers'],
    summary: 'Get servers joined by the authenticated user',
    description: 'Returns all servers that the authenticated user has joined',
    security,
    response: {
      200: objectElement({
        data: arrayElement(reference('Server')),
      }),
    },
  },

  getById: {
    tags: ['Servers'],
    summary: 'Get a server by Id',
    description: "Returns a unique server based on it's Id",
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    response: {
      200: objectElement({
        data: reference('Server'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  create: {
    tags: ['Servers'],
    summary: 'Create a new server',
    description: 'Creates a new server with the provided details',
    security,
    body: objectElement({
      name: stringElement('My Awesome Server', { description: 'Name of the server' }),
    }),
    response: {
      201: objectElement({
        data: reference('Server'),
      }),
      400: NotFound,
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
    },
  },

  update: {
    tags: ['Servers'],
    summary: 'Update an existing server',
    description: 'Updates the details of an existing server',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    body: objectElement({
      name: stringElement('Updated Server Name', { description: 'New name of the server' }),
      description: stringElement('This is an updated description', {
        description: 'New description of the server',
      }),
      icon: stringElement('cmhc8ydab0000qsblnb4nhk8a', {
        description: 'CUID of the new icon file',
      }),
    }),
    response: {
      200: objectElement({
        data: reference('Server'),
      }),
      400: NotFound,
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  delete: {
    tags: ['Servers'],
    summary: 'Delete a server',
    description: 'Deletes an existing server by Id',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    response: {
      200: objectElement({
        message: stringElement('Server deleted successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getServerChannels: {
    tags: ['Servers'],
    summary: 'Get all channels in a server',
    description: 'Returns all channels associated with a specific server',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    response: {
      200: objectElement({
        data: arrayElement(reference('ChannelServer')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  createServerChannel: {
    tags: ['Servers'],
    summary: 'Create a new channel in a server',
    description: 'Creates a new channel within the specified server',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    body: objectElement({
      name: stringElement('general', { description: 'Name of the channel' }),
      type: stringElement('text', {
        description: 'Type of the channel (category or text)',
        enum: ['category', 'text'],
      }),
      parentId: stringElement('cmhc8ydab0000qsblnb4nhk8b', {
        description: 'CUID of the parent category channel',
      }),
    }),
    response: {
      201: objectElement({
        data: reference('ChannelServer'),
      }),
      400: NotFound,
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getServerMembers: {
    tags: ['Servers'],
    summary: 'Get all members of a server',
    description: 'Returns all members associated with a specific server',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    response: {
      200: objectElement({
        data: arrayElement(reference('ServerMember')),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  getServerMemberById: {
    tags: ['Servers'],
    summary: 'Get a server member by Member Id',
    description: 'Returns a specific member of a server by their Member Id',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
      memberId: stringElement('cmhc8ydab0000qsblnb4nhk8b', { description: 'Member Id' }),
    }),
    response: {
      200: objectElement({
        data: reference('ServerMember'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  createServerMember: {
    tags: ['Servers'],
    summary: 'Add a member to a server',
    description: 'Creates a new server member association',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
    }),
    body: objectElement({
      memberId: stringElement('cmhc8ydab0000qsblnb4nhk8b', { description: 'Member Id to add' }),
    }),
    response: {
      201: objectElement({
        data: reference('ServerMember'),
      }),
      400: objectElement({
        message: stringElement('Member already exists in server'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  updateServerMember: {
    tags: ['Servers'],
    summary: 'Update a server member',
    description: 'Updates the details of a server member',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
      memberId: stringElement('cmhc8ydab0000qsblnb4nhk8b', { description: 'Member Id' }),
    }),
    body: objectElement({
      displayName: stringElement('piscau', { description: 'New display name of the member' }),
      avatar: stringElement('cmhc8ydab0000qsblnb4nhk8b', {
        description: 'New avatar of the member',
      }),
      abouteMe: stringElement('I love chatting!', { description: 'New about me of the member' }),
    }),
    response: {
      200: objectElement({
        data: reference('ServerMember'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },

  deleteServerMember: {
    tags: ['Servers'],
    summary: 'Remove a member from a server',
    description: 'Deletes a server member association',
    security,
    params: objectElement({
      id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'Server Id' }),
      memberId: stringElement('cmhc8ydab0000qsblnb4nhk8b', { description: 'Member Id' }),
    }),
    response: {
      200: objectElement({
        message: stringElement('Member removed from server successfully'),
      }),
      401: objectElement({
        message: stringElement('Unauthorized'),
      }),
      404: NotFound,
    },
  },
};
