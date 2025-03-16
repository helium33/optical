import { useState, useRef } from "react";
import { FaUser, FaSignInAlt, FaUserPlus, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import PageLoader from "../../../Component/PageLoader";
import { LucideGlasses } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Header = () => {
  const { data: navItems, error } = useSWR("http://localhost:3001/navbar", fetcher);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (error) return <p>Failed to load menu.</p>;
  if (!navItems) return <PageLoader />;

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setOpenDropdown(null); // Reset dropdown when toggling mobile menu
  };

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
    setOpenDropdown(null); // Reset dropdown state
    navigate(path); // Navigate to the clicked path
  };

  return (
    <nav className="bg-transparent shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="flex justify-center items-center gap-3 text-indigo-600 text-2xl font-bold">
          <LucideGlasses />
          <Link to="/" onClick={() => handleNavClick("/")}>
            Visionary Optics
          </Link>
        </h1>

        {/* Hamburger Menu for Mobile */}
        <button className="md:hidden text-2xl" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.id} className="relative">
              <Link
                to={`/${item.name.toLowerCase()}`}
                className="flex items-center hover:text-blue-500"
                onMouseEnter={() => toggleDropdown(item.name)}
                onMouseLeave={() => toggleDropdown(null)}
              >
                {item.name} <FaChevronDown className="ml-2 text-sm" />
              </Link>
              {openDropdown === item.name && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-md z-50">
                  {item.categories.map((sub) => (
                    <li key={sub.id} className="px-4 py-2 hover:bg-gray-200">
                      <Link
                        to={`/${item.name.toLowerCase()}?category=${sub.filter}`}
                        onClick={() => handleNavClick(`/${item.name.toLowerCase()}?category=${sub.filter}`)}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link to="/contact-us" className="hover:text-blue-500">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md z-50">
            <ul className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center hover:text-blue-500 w-full text-left"
                    >
                      {item.name}
                      <FaChevronDown className="ml-2 text-sm" />
                    </button>
                    {openDropdown === item.name && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.categories.map((sub) => (
                          <li key={sub.id} className="hover:text-blue-500">
                            <Link
                              to={`/${item.name.toLowerCase()}?category=${sub.filter}`}
                              onClick={() =>
                                handleNavClick(`/${item.name.toLowerCase()}?category=${sub.filter}`)
                              }
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-blue-500"
                  onClick={() => handleNavClick("/contact-us")}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center hover:text-blue-500"
                  onClick={() => handleNavClick("/login")}
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="flex items-center hover:text-blue-500"
                  onClick={() => handleNavClick("/signup")}
                >
                  <FaUserPlus className="mr-2" /> Sign Up
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Desktop Login/Signup */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="flex items-center hover:text-blue-500">
            <FaSignInAlt className="mr-2" /> Login
          </Link>
          <Link to="/signup" className="flex items-center hover:text-blue-500">
            <FaUserPlus className="mr-2" /> Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;