import { FastifyReply, FastifyRequest } from 'fastify';
import { createFiles, findFilesByURLs, uploadFiles } from './file.service';

export async function createFilesHandler(req: FastifyRequest, res: FastifyReply) {
  const files = req.files();

  try {
    const uploads = (await uploadFiles(files)).map((f) => ({
      filename: f.filename,
      title: f.title,
      url: f.url,
      mimeType: f.content_type,
      size: f.size,
    }));

    await createFiles(uploads);
    const attachments = await findFilesByURLs(uploads.map((f) => f.url));

    return res.status(201).send({ attachments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error on uploading files' });
  }
}
