import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpa } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <FaSpa className="text-xl text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Mehndi Studio</h3>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm max-w-sm mb-6">
              Experience the perfect blend of traditional artistry and modern elegance.
              Our expert artists bring your beauty vision to life with premium Mehndi and nail art services.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, label: 'Facebook' },
                { icon: FaInstagram, label: 'Instagram' },
                { icon: FaTwitter, label: 'Twitter' },
                { icon: FaWhatsapp, label: 'WhatsApp' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="bg-white/15 hover:bg-white/30 p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Icon className="text-lg text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 pb-2 border-b border-white/20">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/designs', label: 'Browse Designs' },
                { to: '/', label: 'About Us' },
                { to: '/', label: 'Contact' },
                { to: '/appointments', label: 'My Bookings' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-blue-100 hover:text-white text-sm flex items-center gap-2 transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 pb-2 border-b border-white/20">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-blue-100 text-sm">
                <FaPhone className="text-white mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100 text-sm">
                <FaEnvelope className="text-white mt-0.5 flex-shrink-0" />
                <span className="break-all">info@mehndi-studio.com</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100 text-sm">
                <FaMapMarkerAlt className="text-white mt-0.5 flex-shrink-0" />
                <span>123 Beauty Street, Fashion District, City</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-blue-100">
          <p className="flex items-center gap-1.5">
            Made with <FaHeart className="text-red-300 animate-pulse" /> © 2024 Mehndi Studio
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
