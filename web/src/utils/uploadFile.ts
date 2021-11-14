import { getStorage, ref, uploadBytes, UploadResult } from 'firebase/storage';

export interface UploadFile {
  uri: string;
  file: Blob | Uint8Array | ArrayBuffer;
}

export const uploadFile = async ({ uri, file }: UploadFile): Promise<UploadResult> => {
  const storage = getStorage();
  const storageRef = ref(storage, uri);
  return uploadBytes(storageRef, file);
};
