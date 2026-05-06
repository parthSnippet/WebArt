import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';
import { addAppointmentNotification } from '../redux/appointmentSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      socketService.connect(accessToken);

      // Listen for appointment updates
      socketService.on('appointmentUpdated', (appointment) => {
        dispatch(addAppointmentNotification(appointment));
        toast.success(`Appointment ${appointment.status}!`, {
          duration: 5000,
          icon: '🔔'
        });
      });

      // Listen for new notifications
      socketService.on('notification', (notification) => {
        toast(notification.message, {
          icon: notification.type === 'success' ? '✅' : 'ℹ️',
          duration: 4000
        });
      });

      return () => {
        socketService.off('appointmentUpdated');
        socketService.off('notification');
      };
    }
  }, [isAuthenticated, accessToken, dispatch]);

  return socketService;
};
