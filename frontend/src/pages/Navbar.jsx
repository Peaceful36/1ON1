import React from 'react';
import { Link } from 'react-router-dom';


function Navbar({ toggleLinks }) {
    return (
        <header className="text-white py-4">
            <div className="hidden md:flex">
                <div>
                    <h1 className="text-5xl text-white ml-8 font-staatliches hover:text-red-900 duration-200 ">1()N1</h1>
                </div>
                <div className="flex space-x-5 mr-[20px] justify-end w-full">
                    <Link to="/" className="text-3xl font-staatliches text-center hover:text-red-600 duration-200 hover:text-5xl">Home</Link>
                    <Link to="/calendar"  className="text-3xl font-staatliches text-center hover:text-red-600 duration-200 hover:text-5xl">Calendars</Link>
                    <Link to="/contact" className="text-3xl font-staatliches text-center hover:text-red-600 duration-200 hover:text-5xl">Contact</Link>
                    <Link to="/login"  className="text-3xl font-staatliches text-center hover:text-red-600 duration-200 hover:text-5xl">Login</Link>
                    <Link to="/register"  className="text-3xl font-staatliches text-center pr-5 hover:text-red-600 duration-200 hover:text-5xl">Register</Link>
                </div>
            </div>
            <div className="flex md:hidden">
                <div>
                    <h1 className="text-3xl ml-8 font-staatliches">1()N1</h1>
                </div>
                <div className="overflow-hidden text-xl text-white relative color-white ml-auto mr-3">
                    <a href="javascript:void(0);" className="icon" onClick={toggleLinks}>
                        <i className="fa fa-bars"></i>
                    </a>
                </div>
            </div>
        </header>
    );
}

export default Navbar;