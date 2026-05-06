import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    default: null
  },
  customDesignDescription: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for preventing double booking
appointmentSchema.index({ date: 1, time: 1 });

export default mongoose.model('Appointment', appointmentSchema);
