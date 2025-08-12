import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const services = [
    { name: 'Amazon Services', path: '/amazon-services' },
    { name: 'Shopify Services', path: '/shopify-services' },
    { name: 'CGI Ads', path: '/cgi-ads' },
    { name: 'Web Development', path: '/web-development' },
    { name: 'E-commerce Startup', path: '/ecommerce-startup' },
    { name: 'Graphic Design', path: '/graphic-design' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Brand & Social */}
          <div className="space-y-6">
            <img
              src="https://i.postimg.cc/FHB1kmL5/ASSistaura-logo.jpg"
              alt="AssistAura Logo"
          className="w-[120px] md:w-[150px] h-auto"
            />
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/assist_aura/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffbe4a] hover:text-[#2a3747] transition-colors duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/assistaura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffbe4a] hover:text-[#2a3747] transition-colors duration-300"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h3 className="font-anton text-xl text-[#2a3747] mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="font-anton text-[#2a3747] hover:text-[#ffbe4a] transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="font-anton text-xl text-[#2a3747] mb-6">Contact</h3>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#ffbe4a] hover:text-[#2a3747] transition-colors duration-300" />
              <a
                href="mailto:assistaura9@gmail.com"
                className="font-anton text-[#2a3747] hover:text-[#ffbe4a] transition-colors duration-300"
              >
                assistaura9@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center font-anton text-sm text-[#2a3747]">
            © 2025 AssistAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;