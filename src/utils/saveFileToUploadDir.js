import fs from 'node:fs/promises';

import path from 'node:path';

import { UPLOAD_DIR } from '../constant/index.js';

const saveFileToUploadDir = async (file) => {
  // geçici klasör dosya yolu

  const oldPath = file.path;

  const fileName = file.fileName;

  //yeni dosya yolu

  const newPath = path.join(UPLOAD_DIR, file);

  await fs.rename(oldPath, newPath);

  return fileName;
};

export default saveFileToUploadDir;
