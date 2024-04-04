import * as React from "react";
import Navbar from "./Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "./Calendar.css";
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const localizer = dayjsLocalizer(dayjs);

function Calendar_view() {
  const [events, setEvents] = useState([]);
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { token } = useAuth(); // Get the authentication token using the useAuth hook

  const handleAutoGen = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}/generate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    })
    .then((data) => {
      setEvents(data); // Update state variable with the fetched data
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
  };
 
  useEffect(() => {
    handleAutoGen(); // Fetch events on component mount
  }, []); 

// Parse start and end dates with time
// const processedEvents = events[0].map(event => ({
//   start: new Date(event.start_date),
//   end: new Date(event.end_date),
//   title: event.title,
// }));

  return (
    <div>
      <Navbar />
      <div className="font-staatliches text-6xl leading-8 text-white text-center">
        My Calendar
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          id="contact"
          className="text-white font-staatliches mt-11 ml-4 md:h-full border-none list-square text-left"
        >
          <h1 className="text-5xl ml-0 sm:text-center">PEOPLE</h1>
          <ul className="custom-list text-2xl mt-3 ml-8">
            <div className="ml-5 mb-5">Inaam</div>
            <div className="ml-5 mb-5">Nipun</div>
            <div className="ml-5 mb-5">Noel</div>
            <div className="ml-5 mb-5">Hoa</div>
          </ul>
          <button
            className="login-button w-48 h-12 bg-white rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2"
            onClick={() => (window.location = "moreDetails.html")}
          >
            MORE DETAILS
          </button>
        </div>
        <div
          id="calendar"
          className="bg-white rounded-md w-3/4 shadow-md mt-10 ml-0 text-sm sm:ml-24 text-base"
        >
          <div>
            <Calendar
              localizer={localizer}
              events={events[0]}
              
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </div>
          <button
            onClick={handleAutoGen}
            className="login-button w-48 h-12 bg-white mb-1 rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2 w-75px h-40px ml-9 sm:w-192px h-48px"
          >
            AUTO-GENERATE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calendar_view;
