import { FastifyInstance } from 'fastify';

export async function registerSchemas(app: FastifyInstance) {
  app.addSchema({
    $id: 'Message',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'cmhcas3i00001qsblnb4nhk8o' },
      content: { type: 'string', example: 'This is a message!' },
      authorId: { type: 'string', example: 'cmhcbfs0i0001qsebq6e0bw6a' },
      private: { type: 'boolean', example: false },
      silent: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      author: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John' },
          displayName: { type: 'string', example: 'John v2' },
          avatar: {
            type: 'string',
            example:
              'https://cdn.discordapp.com/avatars/709440492890488873/f8e1c6b1b8a17f67a2bdb91ec41b40f2.png?size=2048',
          },
        },
      },
      repliedTo: {
        type: 'array',
        items: { type: 'string', example: 'cmhcas3i00001qsblnb4nhk8o' },
        maxItems: 5,
      },
    },
  });

  app.addSchema({
    $id: 'User',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'cmhcas3i00001qsblnb4nhk8o' },
      email: { type: 'string', example: 'example@email.com' },
      name: { type: 'string', example: 'John' },
      displayName: { type: 'string', example: 'not John v2' },
      avatar: {
        type: 'string',
        example:
          'https://tenor.com/view/monster-versus-vs-alien-monster-vs-alien-gif-16037253809360562033',
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  });

  app.addSchema({
    $id: 'Attachment',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'cmhcas3i00001qsblnb4nhk8o' },
      filename: { type: 'string', example: 'Captura_de_tela_2025-09-21_015301.png' },
      title: { type: 'string', example: 'Captura de tela 2025-09-21 015301' },
      url: {
        type: 'string',
        example:
          'https://cdn.discordapp.com/attachments/1361805363590070352/1433877162578149789/Captura_de_tela_2025-09-21_015301.png?ex=690649ab&is=6904f82b&hm=791d127616ab576b2ba1bc71ac742c9d16562fc155ff815fb9f8511ea5c36fc9&',
      },
      mimeType: { type: 'string', example: 'image/png' },
      size: { type: 'number', example: 160213 },
    },
  });
}
