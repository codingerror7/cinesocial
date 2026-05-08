import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp directory exists
const tempDir = path.join(__dirname, '..', 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Add timestamp to avoid filename conflicts
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
})

const upload = multer(
    { 
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    }
);

export default upload;