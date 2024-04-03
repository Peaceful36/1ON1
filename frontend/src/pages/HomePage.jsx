import React, { useState } from 'react';
import Navbar from './Navbar';
import mainPageImage from '../media/main-page.png';


function App() {
    const [showLinks, setShowLinks] = useState(false);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    return (
        <div className=" overflow-hidden">
            <Navbar />
            <div className="my-auto md:pt-0 md:mx-auto px-4 md:flex h-screen items-center">
                <div className="md:w-1/2 justify-center text-center md:justify-end items-center">
                    <h2 className="text-9xl font-staatliches text-red-600 mt-10 text-center">1 ON 1</h2>
                    <h2 className="text-6xl font-staatliches text-white mt-2 pb-20 text-center">Scheduling Tool</h2>
                </div>
                <div className="hidden md:flex w-1/2 justify-end items-center relative">
                <div className="hidden md:flex w-full md:w-1/2 justify-end items-center relative">
                <div className="hidden md:flex w-full md:w-1/2 justify-end items-center relative">
                    <img className="w-full md:w-full max-w-none object-cover object-right transition-transform duration-1200 transform translate-x-40 translate-y-[-10%] hover:translate-x-10 scale-90 hover:scale-100" src={mainPageImage} alt="Logo" style={{ width: '500%' }} />
                </div>
                </div>
                </div>

            </div>
        </div>
    ); 

}

export default App;
