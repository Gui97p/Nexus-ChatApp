import { arrayElement, objectElement, reference, security, stringElement } from '../../utils/docs';

const UserId = objectElement(
  {
    id: stringElement('cmhc8ydab0000qsblnb4nhk8a', { description: 'User Id' }),
  },
  { required: ['id'] },
);
const NotFound = objectElement({
  message: stringElement('User not found'),
});

export const UserDocs = {
  getAll: {
    tags: ['Users'],
    summary: 'Get all users',
    description: 'Returns all users.',
    security,
    response: {
      200: objectElement({
        data: arrayElement(reference('User')),
      }),
    },
  },

  getById: {
    tags: ['Users'],
    summary: 'Gets user by Id',
    description: 'Returns an user based on an Id.',
    security,
    params: UserId,
    response: {
      200: objectElement({
        data: reference('User'),
      }),
      404: NotFound,
    },
  },

  getMe: {
    tags: ['Users'],
    summary: 'Gets own user data',
    description: 'Returns own user based on Authorization token.',
    security,
    response: {
      200: objectElement(undefined, reference('User')),
      404: NotFound,
    },
  },

  create: {
    tags: ['Users'],
    summary: 'Registers a new User',
    description: 'Creates a new User',
    body: objectElement(
      {
        name: stringElement('Jordan'),
        email: stringElement('example@email.com'),
        password: stringElement('StrongPassword123'),
      },
      { required: ['name', 'email', 'password'] },
    ),
    response: {
      200: objectElement(undefined, reference('User')),
      409: objectElement({
        message: stringElement('Email/Username already in use'),
      }),
    },
  },

  update: {
    tags: ['Users'],
    summary: 'Updates an User',
    description: 'Updates own User based on an Id',
    security,
    params: UserId,
    body: objectElement({
      name: stringElement('Jordan'),
      email: stringElement('example@email.com'),
      displayName: stringElement('not Jordan :)'),
      avatar: stringElement('cmhcas3i00001qsblnb4nhk8o'),
    }),
    response: {
      200: objectElement({
        message: stringElement('User updated successfully'),
      }),
      403: objectElement({
        message: stringElement('You can only update your own account'),
      }),
      404: NotFound,
      409: objectElement({
        message: stringElement('Email/Username already in use'),
      }),
    },
  },

  delete: {
    tags: ['Users'],
    summary: 'Deletes an User',
    description: 'Deletes own User based on an Id.',
    security,
    params: UserId,
    response: {
      200: objectElement({
        message: stringElement('User deleted successfully'),
      }),
      403: objectElement({
        message: stringElement('You can only delete your own account'),
      }),
      404: NotFound,
    },
  },
};
