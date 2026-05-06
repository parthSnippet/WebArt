import Design from '../models/Design.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/upload.js';

export const getDesigns = async (req, res) => {
  try {
    console.log('💾 Backend: Getting designs with query:', req.query);
    const { category } = req.query;
    const filter = category ? { category } : {};
    console.log('💾 Backend: Using filter:', filter);
    
    const designs = await Design.find(filter).sort({ createdAt: -1 });
    console.log('💾 Backend: Found designs:', {
      count: designs.length,
      designs: designs.map(d => ({
        id: d._id,
        title: d.title,
        imageUrl: d.imageUrl,
        category: d.category
      }))
    });
    
    res.json({ success: true, count: designs.length, data: designs });
  } catch (error) {
    console.error('❌ Backend: Get designs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    res.json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDesign = async (req, res) => {
  try {
    console.log('📝 Backend: Creating design with body:', req.body);
    console.log('📝 Backend: File info:', {
      hasFile: !!req.file,
      filename: req.file?.filename,
      path: req.file?.path,
      originalname: req.file?.originalname
    });
    
    const { title, description, category } = req.body;

    if (!req.file) {
      console.error('❌ Backend: No file provided');
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const result = await uploadToCloudinary(req.file.path, 'mehndi-designs');
    console.log('📝 Backend: Upload result:', result);

    const design = await Design.create({
      title,
      description,
      category,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });
    
    console.log('✅ Backend: Design created successfully:', {
      id: design._id,
      title: design.title,
      imageUrl: design.imageUrl
    });

    res.status(201).json({ success: true, data: design });
  } catch (error) {
    console.error('❌ Backend: CREATE DESIGN ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDesign = async (req, res) => {
  try {
    let design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

    const { title, description, category } = req.body;
    const updateData = { title, description, category };

    if (req.file) {
      if (design.cloudinaryId) await deleteFromCloudinary(design.cloudinaryId);
      const result = await uploadToCloudinary(req.file.path, 'mehndi-designs');
      updateData.imageUrl = result.secure_url;
      updateData.cloudinaryId = result.public_id;
    }

    design = await Design.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: design });
  } catch (error) {
    console.error('UPDATE DESIGN ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

    if (design.cloudinaryId) await deleteFromCloudinary(design.cloudinaryId);
    await design.deleteOne();

    res.json({ success: true, message: 'Design deleted' });
  } catch (error) {
    console.error('DELETE DESIGN ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
