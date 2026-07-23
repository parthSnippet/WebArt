import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesign } from '../../redux/designSlice';
import { createAppointment } from '../../redux/appointmentSlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaCalendar, FaClock, FaStar, FaHeart, FaShare, FaCheckCircle, FaUsers } from 'react-icons/fa';

const DesignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDesign, loading } = useSelector((state) => state.designs);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [bookingData, setBookingData] = useState({
    date: '',
    time: ''
  });

  useEffect(() => {
    dispatch(fetchDesign(id));
  }, [id, dispatch]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    try {
      await dispatch(createAppointment({
        designId: id,
        ...bookingData
      })).unwrap();

      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      toast.error(error || 'Failed to book appointment');
    }
  };

  if (loading || !currentDesign) return <Loader />;

  return (
    <div className="min-h-[90vh] py-8 sm:py-10 lg:py-12 px-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4 lg:space-y-5">
            <div className="relative group">
              <img
                src={currentDesign.imageUrl}
                alt={currentDesign.title}
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
                <button className="bg-white border border-blue-200 p-2.5 sm:p-3 rounded-full hover:bg-blue-50 transition-all shadow-lg">
                  <FaHeart className="text-blue-500" />
                </button>
                <button className="bg-white border border-blue-200 p-2.5 sm:p-3 rounded-full hover:bg-blue-50 transition-all shadow-lg">
                  <FaShare className="text-blue-500" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-blue-200 shadow-xl p-4 sm:p-6 rounded-3xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500 text-lg sm:text-xl">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-gray-900 font-bold text-sm sm:text-base">4.9</span>
                </div>
                <span className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                  <FaUsers /> 250+ bookings
                </span>
              </div>
            </div>
          </div>

          <div className="lg:pt-2">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 capitalize border border-blue-200">
              {currentDesign.category}
            </span>

            {/* <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 sm:mb-5">
              {currentDesign.title}
            </h1> */}

            <p className="text-sm sm:text-base lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              
              Fill your hands with the most beautiful and intricate designs.
            </p>

            <div className="bg-white border border-blue-200 shadow-xl p-5 sm:p-8 rounded-3xl">
              <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex-1">
                  Book This Design
                </h3>
                <div className="shrink-0 bg-blue-50 border border-blue-100 rounded-2xl p-3">
                  <FaCalendar className="text-blue-500 text-xl" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
                Choose a date and time that works best for you.
              </p>

              <form onSubmit={handleBooking} className="space-y-5 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-gray-800 font-semibold text-sm sm:text-base flex items-center gap-2">
                    <FaCalendar className="text-blue-500" /> Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3.5 sm:py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-gray-900 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-gray-800 font-semibold text-sm sm:text-base flex items-center gap-2">
                    <FaClock className="text-blue-500" /> Select Time
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    required
                    className="w-full px-4 py-3.5 sm:py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-gray-900 text-sm sm:text-base focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  >
                    <option value="" className="bg-white">Choose a time slot</option>
                    <option value="09:00 AM" className="bg-white">09:00 AM</option>
                    <option value="10:00 AM" className="bg-white">10:00 AM</option>
                    <option value="11:00 AM" className="bg-white">11:00 AM</option>
                    <option value="12:00 PM" className="bg-white">12:00 PM</option>
                    <option value="02:00 PM" className="bg-white">02:00 PM</option>
                    <option value="03:00 PM" className="bg-white">03:00 PM</option>
                    <option value="04:00 PM" className="bg-white">04:00 PM</option>
                    <option value="05:00 PM" className="bg-white">05:00 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-500 px-6 py-4 sm:py-5 text-base sm:text-lg font-extrabold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
                >
                  Book Appointment Now!
                </button>
              </form>

              <p className="text-gray-600 text-xs sm:text-sm mt-4 text-center flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-500" /> 100% Satisfaction Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
