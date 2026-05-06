import Content from '../models/Content.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/upload.js';

export const getContent = async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const content = await Content.find();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const updateData = { title, description };

    let content = await Content.findOne({ section: req.params.section });

    if (req.file) {
      if (content?.cloudinaryId) await deleteFromCloudinary(content.cloudinaryId);
      const result = await uploadToCloudinary(req.file.path, 'mehndi-content');
      updateData.imageUrl = result.secure_url;
      updateData.cloudinaryId = result.public_id;
    } else if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    content = await Content.findOneAndUpdate(
      { section: req.params.section },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
