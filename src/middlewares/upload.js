// import multer from 'multer';
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });
import multer from 'multer';
import path from 'path';
import { createDirIfNotExists } from '../utils/createDirIfNotExists.js';

// Temp dizini oluştur
const tempDir = createDirIfNotExists(path.join(process.cwd(), 'temp'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
