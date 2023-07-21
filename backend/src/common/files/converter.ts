import { FileUpload } from "graphql-upload-minimal";

export async function convertFileIntoBuffer(file: FileUpload): Promise<{ buffer: Buffer, filename: string, contentType: string }> {

  const anyFile = file as any;
  if (!anyFile.createReadStream)
    return { buffer: null, filename: "", contentType: "" };

  const { createReadStream, filename, mimetype } = file;
  const ms = createReadStream();
  const buffer = await convertReadStreamIntoBuffer(ms) as Buffer;
  return { buffer, filename: filename, contentType: mimetype };
}

export function convertReadStreamIntoBuffer(stream: NodeJS.ReadableStream) {

  return new Promise(async (resolve, reject) => {

    try {
      const chunks: Buffer[] = [];

      stream.once("error", (err) => {
        reject(err);
      });

      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }
    catch (error) {
      reject(error);
    }
  });
}
