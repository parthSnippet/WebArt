import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required']
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mehndi', 'nailart', 'bridal', 'arabic', 'traditional', 'modern']
  }
}, {
  timestamps: true
});

export default mongoose.model('Design', designSchema);
