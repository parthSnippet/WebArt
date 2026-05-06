import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
              Mehndi Studio ✨
            </h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Experience the perfect blend of traditional artistry and modern elegance. 
              Our expert artists bring your beauty vision to life with premium Mehndi and nail art services.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-pink-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/designs" className="text-white/70 hover:text-pink-300 transition-colors flex items-center gap-2">
                  → Browse Designs
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-pink-300 transition-colors flex items-center gap-2">
                  → About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/70 hover:text-pink-300 transition-colors flex items-center gap-2">
                  → Contact
                </a>
              </li>
              <li>
                <a href="/appointments" className="text-white/70 hover:text-pink-300 transition-colors flex items-center gap-2">
                  → My Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-pink-300 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <FaPhone className="text-pink-400 mt-1" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <FaEnvelope className="text-pink-400 mt-1" />
                <span>info@mehndi studio.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <FaMapMarkerAlt className="text-pink-400 mt-1" />
                <span>123 Beauty Street, Fashion District, City</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm flex items-center gap-2">
              Made with <FaHeart className="text-pink-400 animate-pulse" /> © 2024 Mehndi Studio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/60">
              <a href="/privacy" className="hover:text-pink-300 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-pink-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
