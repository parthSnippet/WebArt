import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Create uploads folder if it doesn't exist (fallback for development)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage (for temporary files before Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = unique + path.extname(file.originalname);
    cb(null, filename);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    // Check file size (additional security)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size && file.size > maxSize) {
      return cb(new Error('File too large. Maximum size is 10MB'), false);
    }
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1 // Only one file at a time
  },
  fileFilter
});

export const uploadToCloudinary = async (filePath, folder = 'mehndi-designs') => {
  try {
    if (!fs.existsSync(filePath)) throw new Error('File not found');

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `mehndi-booking/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 900, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      use_filename: true,
      unique_filename: true
    });

    try { fs.unlinkSync(filePath); } catch {}

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch {}
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
};
