import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Mehndi & Nail Art" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendAppointmentConfirmation = async (user, appointment) => {
  const html = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${user.name},</p>
    <p>Your appointment has been booked successfully!</p>
    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${appointment.time}</p>
    <p><strong>Status:</strong> ${appointment.status}</p>
    <p>We will notify you once your appointment is confirmed.</p>
    <br>
    <p>Thank you for choosing us!</p>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Appointment Confirmation',
    html
  });
};

export const sendAppointmentStatusUpdate = async (user, appointment) => {
  const html = `
    <h2>Appointment Status Update</h2>
    <p>Dear ${user.name},</p>
    <p>Your appointment status has been updated to: <strong>${appointment.status}</strong></p>
    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${appointment.time}</p>
    ${appointment.remarks ? `<p><strong>Remarks:</strong> ${appointment.remarks}</p>` : ''}
    <br>
    <p>Thank you!</p>
  `;

  return await sendEmail({
    to: user.email,
    subject: `Appointment ${appointment.status}`,
    html
  });
};
