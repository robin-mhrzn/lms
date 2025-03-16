"use client";

import { useState } from "react";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">LMS Logo</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Courses
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 absolute top-full left-0 right-0">
          <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">
            Home
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">
            Courses
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">
            About
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};
export default Header;
