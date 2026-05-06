import Appointment from '../models/Appointment.js';
import { sendAppointmentConfirmation } from '../utils/email.js';

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  try {
    const { designId, customDesignDescription, date, time } = req.body;

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      designId: designId || null,
      customDesignDescription,
      date,
      time
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email')
      .populate('designId', 'title imageUrl');

    // Send email notification
    await sendAppointmentConfirmation(req.user, populatedAppointment);

    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('designId', 'title imageUrl')
      .sort({ date: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email')
      .populate('designId', 'title imageUrl')
      .sort({ date: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('designId', 'title imageUrl');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Send Socket.io notification
    const io = req.app.get('io');
    io.emit('appointmentUpdated', appointment);

    // Send email notification
    const { sendAppointmentStatusUpdate } = await import('../utils/email.js');
    await sendAppointmentStatusUpdate(appointment.userId, appointment);

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment (User)
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
