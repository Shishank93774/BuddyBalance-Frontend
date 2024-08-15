import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const { user, logout } = useAuth();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Add and remove event listener for clicks outside of the dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center z-50 sticky top-0 left-0 w-full">
      {/* App Name / Logo */}
      <div
        className="text-2xl font-bold text-gray-800 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <div className="relative w-9 h-9 flex flex-row">
          <img
            src='/assets/logo3.png'
            alt='app-logo'
            className="object-cover w-full h-full rounded-full"
          />
          BuddyBalance
        </div>
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
          <div
            ref={dropdownRef} // Attach ref to the dropdown menu
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link to="/groups" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Manage Groups
                </Link>
                <Link to="/auth" onClick={() => { logout(); }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/auth?mode=signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  SignUp
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
