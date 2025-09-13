import fs from 'fs';
import path from 'path';

// export const createDirIfNotExists = async (url) => {
//   try {
//     await fs.access(url);
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       await fs.mkdir(url, { recursive: true });
//     }
//   }
// };

export const createDirIfNotExists = () => {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};
