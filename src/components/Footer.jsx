import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 w-full -mb-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* App Name / Logo */}
          <div className="text-2xl font-bold">
            BuddyBalance
          </div>

          {/* Footer Links */}
          <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">
              About Us
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="https://linkedin.com/in/shishank-rawat" target="_blank" rel="noopener noreferrer">
              <img src="/assets/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/instagram.png" alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/twitter.png" alt="Twitter" className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} BuddyBalance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
