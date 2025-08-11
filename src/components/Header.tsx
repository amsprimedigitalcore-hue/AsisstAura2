import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'Amazon Services', path: '/amazon-services' },
    { name: 'Shopify Services', path: '/shopify-services' },
    { name: 'Meta Ads', path: '/meta-ads' },
    { name: 'Web Development', path: '/web-development' },
    { name: 'CGI Ads', path: '/cgi-ads' },
    { name: 'Graphic Design', path: '/graphic-design' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex-shrink-0">
            <img
              src="https://i.postimg.cc/FHB1kmL5/ASSistaura-logo.jpg"
              alt="AssistAura Logo"
              className="w-[110px] md:w-[81px] h-20"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link
              to="/"
              className={`font-anton text-lg transition-colors duration-300 hover:text-[#ffbe4a] ${
                isActive('/') ? 'text-[#ffbe4a]' : 'text-[#2a3747]'
              }`}
            >
              Home
            </Link>
            
            <button
              onClick={() => scrollToSection('about')}
              className="font-anton text-lg transition-colors duration-300 hover:text-[#ffbe4a] text-[#2a3747]"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection('reviews')}
              className="font-anton text-lg transition-colors duration-300 hover:text-[#ffbe4a] text-[#2a3747]"
            >
              Reviews
            </button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button 
                onClick={() => scrollToSection('services')}
                className="font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] transition-colors duration-300 flex items-center"
              >
                Services
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border"
                  >
                    <div className="py-2">
                      {services.map((service, index) => (
                        <Link
                          key={service.name}
                          to={service.path}
                          className="block px-4 py-3 font-anton text-sm text-[#2a3747] hover:bg-[#ffbe4a]/10 hover:text-[#ffbe4a] transition-colors duration-300"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex-1 md:hidden" />
          <button
            className="md:hidden p-3 text-[#2a3747] hover:text-[#ffbe4a] transition-colors duration-300 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="py-6 space-y-1">
                <Link
                  to="/"
                  className="block font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-lg mx-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    scrollToSection('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-lg mx-4 text-left w-full"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    scrollToSection('reviews');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-lg mx-4 text-left w-[calc(100%-2rem)]"
                >
                  Reviews
                </button>
                <div className="px-4 pt-2">
                  <button
                    onClick={() => {
                      scrollToSection('services');
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-anton text-lg text-[#2a3747] mb-3 hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-2 py-2 rounded-lg block w-full text-left"
                  >
                    Services
                  </button>
                  <div className="pl-4 space-y-1">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.path}
                        className="block font-anton text-base text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-3 py-2 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;