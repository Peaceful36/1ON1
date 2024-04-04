import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import { FaBars } from "react-icons/fa";


function Navbar({ toggleLinks }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="text-white py-4">
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center mx-8">
        <div className="flex items-center space-x-5">
          <h1 className="text-5xl font-staatliches hover:text-red-900 duration-200">
            1()N1
          </h1>
          {user && (
            <a className="text-5xl text-red-600 font-staatliches pr-5">
              {JSON.parse(user).username}
            </a>
          )}
        </div>
        <div className="flex items-center space-x-5">
          <Link
            to="/"
            className="text-3xl font-staatliches hover:text-red-600 duration-200"
          >
            Home
          </Link>
          <Link
            to="/calendar"
            className="text-3xl font-staatliches hover:text-red-600 duration-200"
          >
            Calendars
          </Link>
          <Link
            to="/contact"
            className="text-3xl font-staatliches hover:text-red-600 duration-200"
          >
            Contact
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-3xl font-staatliches hover:text-red-600 duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-3xl font-staatliches hover:text-red-600 duration-200"
              >
                Register
              </Link>
            </>
          ) : (
            <a
              onClick={() => logout()}
              className="text-3xl font-staatliches hover:text-red-600 duration-200"
            >
              Logout
            </a>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col justify-center items-center">
      <div className="flex">
        <h1 className="text-5xl font-staatliches ml-[15%]  hover:text-red-900 duration-200">
            1()N1
        </h1>
        <button onClick={toggleDropdown} className="text-white text-xl ml-[150%]">
            {showDropdown ? <FaBars /> : <FaBars />}
        </button>
        </div>

        {showDropdown && (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Link
              to="/"
              className="text-3xl font-staatliches hover:text-red-600 duration-200"
            >
              Home
            </Link>
            <Link
              to="/calendar"
              className="text-3xl font-staatliches hover:text-red-600 duration-200"
            >
              Calendars
            </Link>
            <Link
              to="/contact"
              className="text-3xl font-staatliches hover:text-red-600 duration-200"
            >
              Contact
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-3xl font-staatliches hover:text-red-600 duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-3xl font-staatliches hover:text-red-600 duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <a
                onClick={() => logout()}
                className="text-3xl font-staatliches hover:text-red-600 duration-200"
              >
                Logout
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
