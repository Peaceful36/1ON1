import React, { useState } from 'react';
import './App.css'; // Make sure to import your CSS file
import mainPageImage from './media/main-page.png';


function App() {
    const [showLinks, setShowLinks] = useState(false);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    return (
        <div className=" overflow-hidden">
            <header className=" text-white py-4">
                <div className="hidden md:flex">
                    <div>
                        <h1 className="text-5xl text-white ml-8 font-staatliches">1()N1</h1>
                    </div>
                    <div className="flex space-x-5 mr-[20px] justify-end w-full">

                        {/* Change to react routers */}
                        <a href="index.html" className="text-3xl font-staatliches text-center">Home</a>
                        <a href="calendars.html" className="text-3xl font-staatliches text-center">Calendars</a>
                        <a href="contact.html" className="text-3xl font-staatliches text-center">Contact</a>
                        <a href="login.html" className="text-3xl font-staatliches text-center">Login</a>
                        <a href="register.html" className="text-3xl font-staatliches text-center pr-5">Register</a>
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
            <ul id="myLinks" className={`text-center ${showLinks ? '' : 'hidden'}`}>
                <li className='text-black py-3 text-2xl bg-white no-underline'>
                    <a href="index.html" className="text-2xl font-staatliches text-center">Home</a>
                </li>
                <li className='text-black py-3 text-2xl bg-white'>
                    <a href="calendars.html" className="text-2xl font-staatliches text-center">Calendars</a>
                </li>
                <li className='text-black py-3 text-2xl bg-white'>
                    <a href="contact.html" className="text-2xl font-staatliches text-center">Contact</a>
                </li>
                <li className='text-black py-3 text-2xl bg-white'>
                    <a href="login.html" className="text-2xl font-staatliches text-center">Login</a>
                </li>
                <li className='text-black py-3 text-2xl bg-white'>
                    <a href="register.html" className="text-2xl font-staatliches text-center">Register</a>
                </li>
            </ul>
            <div className="my-auto md:pt-0 md:mx-auto px-4 md:flex h-screen items-center">
                <div className="md:w-1/2 justify-center text-center md:justify-end items-center">
                    <h2 className="text-9xl font-staatliches text-red-600 mt-10 text-center">1 ON 1</h2>
                    <h2 className="text-6xl font-staatliches text-white mt-2 pb-20 text-center">Scheduling Tool</h2>
                </div>
                <div className="hidden md:flex w-1/2 justify-end items-center relative">
                <div className="hidden md:flex w-full md:w-1/2 justify-end items-center relative">
                <div className="hidden md:flex w-full md:w-1/2 justify-end items-center relative">
                    <img className="w-full md:w-full max-w-none object-cover object-right" src={mainPageImage} alt="Logo" style={{ width: '500%' }} />
                </div>
                </div>
                </div>

            </div>
        </div>
    );
}

export default App;
