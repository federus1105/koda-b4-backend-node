import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads');
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and webp files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 },
  fileFilter: fileFilter
});

export default upload;
 