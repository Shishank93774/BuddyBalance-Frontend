import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 left-0 w-full">
      {/* App Name / Logo */}
      <div className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}>
        BuddyBalance
      </div>

      {/* Profile Icon and Dropdown */}
      <div className="relative">
        <button
          className="flex items-center focus:outline-none"
          onClick={toggleDropdown}
        >
          <img
            src="/assets/user.png" // Placeholder image
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <Link to="/auth?mode=login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Login
            </Link>
            <Link to="/auth?mode=signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              SignUp
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
