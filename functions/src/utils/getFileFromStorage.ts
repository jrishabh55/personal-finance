import admin from 'firebase-admin';

const getFileFromStorage = async (path: string): Promise<Buffer> => {
  const gcsStream = admin.storage().bucket().file(path).createReadStream();
  console.log('creating stream', path);

  const allBuffer: Promise<Buffer> = new Promise((resolve) => {
    const buffers: Buffer[] = [];
    gcsStream.on('data', function (data) {
      buffers.push(data);
    });

    gcsStream.on('end', function () {
      console.log('onEnd', path);
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });
  });

  return allBuffer;
};

export default getFileFromStorage;
