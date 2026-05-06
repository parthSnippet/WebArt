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
    <div className="min-h-[90vh] py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={currentDesign.imageUrl}
                alt={currentDesign.title}
                className="w-full rounded-3xl shadow-2xl"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-all">
                  <FaHeart className="text-pink-400" />
                </button>
                <button className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-all">
                  <FaShare className="text-blue-400" />
                </button>
              </div>
            </div>
            
            {/* Rating & Reviews */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-xl">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-white font-bold">4.9</span>
                </div>
                <span className="text-white/70 flex items-center gap-2"><FaUsers /> 250+ bookings</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 capitalize">
              {currentDesign.category} <FaStar />
            </span>
            
            <h1 className="text-5xl font-black text-white mb-4">
              {currentDesign.title}
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {currentDesign.description}
            </p>

            {/* Booking Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                Book This Design <FaCalendar className="text-pink-400" />
              </h3>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FaCalendar className="text-pink-400" /> Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FaClock className="text-pink-400" /> Select Time
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    required
                    className="w-full px-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500 transition-all backdrop-blur-sm"
                  >
                    <option value="" className="bg-gray-800">Choose a time slot</option>
                    <option value="09:00 AM" className="bg-gray-800">09:00 AM</option>
                    <option value="10:00 AM" className="bg-gray-800">10:00 AM</option>
                    <option value="11:00 AM" className="bg-gray-800">11:00 AM</option>
                    <option value="12:00 PM" className="bg-gray-800">12:00 PM</option>
                    <option value="02:00 PM" className="bg-gray-800">02:00 PM</option>
                    <option value="03:00 PM" className="bg-gray-800">03:00 PM</option>
                    <option value="04:00 PM" className="bg-gray-800">04:00 PM</option>
                    <option value="05:00 PM" className="bg-gray-800">05:00 PM</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Book Appointment Now! <FaStar />
                </button>
              </form>

              <p className="text-white/60 text-sm mt-4 text-center flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-400" /> 100% Satisfaction Guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
