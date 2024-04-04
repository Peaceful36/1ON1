
import * as React from "react";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';

function Calendars() {
  
    return (
        <div>
            <Navbar />

            <Link to="/calendar_view/1" className="text-3xl font-staatliches text-white text-center hover:text-red-600 duration-200 hover:text-5xl">Calendar 1</Link>
            
    </div>
  );
}

export default Calendars