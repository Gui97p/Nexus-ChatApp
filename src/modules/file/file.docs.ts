import { arrayElement, objectElement, reference, security, stringElement } from '../../utils/docs';

export const fileDocs = {
  create: {
    tags: ['Files'],
    summary: 'Creates new files',
    description: 'Uploads new files in database to be linked',
    security,
    consumes: ['multipart/form-data'],
    body: objectElement({
      files: arrayElement(
        stringElement(undefined, {
          format: 'binary',
        }),
      ),
    }),
    response: {
      201: objectElement({
        attachments: arrayElement(reference('Attachment')),
      }),
      500: objectElement({
        message: stringElement('Error on uploading files'),
      }),
    },
  },
};
