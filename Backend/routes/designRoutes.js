import express from 'express';
import {
  getDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign
} from '../controllers/designController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', getDesigns);
router.get('/:id', getDesign);
router.post('/', protect, admin, upload.single('image'), createDesign);
router.put('/:id', protect, admin, upload.single('image'), updateDesign);
router.delete('/:id', protect, admin, deleteDesign);

export default router;
