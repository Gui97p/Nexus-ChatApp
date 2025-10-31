import axios from 'axios';
import prisma from '../../utils/prisma';
import { WebhookResponse } from './file.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadFiles(files: any): Promise<WebhookResponse[]> {
  if (!process.env.WEBHOOK_URL) return Promise.reject();

  const formData = new FormData();

  let index = 0;
  for await (const file of files) {
    const buffer = await file.toBuffer();
    formData.append(`file${index}`, new Blob([buffer]), file.filename);
    index++;
  }

  const response = await axios.post(process.env.WEBHOOK_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data && response.data.attachments ? response.data.attachments : Promise.reject();
}

export function findFilesByURLs(URLs: string[]) {
  return prisma.attachment.findMany({
    where: { url: { in: URLs } },
    omit: { messageId: true },
  });
}

export function createFiles(
  data: {
    filename: string;
    size: number | undefined;
    url: string;
    mimeType: string | undefined;
    title: string;
  }[],
) {
  return prisma.attachment.createMany({
    data,
  });
}
