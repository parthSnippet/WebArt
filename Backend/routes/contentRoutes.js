import express from 'express';
import { getContent, getAllContent, updateContent } from '../controllers/contentController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:section', getContent);
router.put('/:section', protect, admin, upload.single('image'), updateContent);

export default router;
