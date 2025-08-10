// middlewares/uploadMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory before uploading to Firebase
const upload = multer({ storage });

export default upload;

