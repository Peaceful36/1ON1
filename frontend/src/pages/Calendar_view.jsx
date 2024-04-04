import * as React from "react";
import Navbar from "./Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "./Calendar.css";
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const localizer = dayjsLocalizer(dayjs);

function Calendar_view() {
  const [preferences, setPreferences] = useState([]);

  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { token } = useAuth(); // Get the authentication token using the useAuth hook

  const navigate = useNavigate();
  const handleAutoGen = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}/generate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        alert("Cannot auto-generate preferences. Make sure at least one participant has submitted their preferences.");
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
    })
    .then((data) => {
      setPreferences(data); // Update state variable with the fetched data
    })
    .catch((error) => {
      console.error('Error fetching preferences:', error);
    });
  };

  const [participants, setParticipants] = useState([]);
  const getParticipants = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}/participants`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          
          throw new Error("Failed to fetch participants");
        }
        return response.json();
      })
      .then((data) => {
        setParticipants(data); // Update state variable with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching participants:", error);
      });
  };
  //console.log(preferences.result[0]);

  useEffect(() => {
    getParticipants(); // Fetch participants on component mount
  }, []);

  // useEffect(() => {
  //   handleAutoGen(); // Fetch events on component mount
  // }, []);
  const preferencesData = {
    start: null,
    end: null,
    title: null,
  };

  if (preferences.result !== undefined) {
    preferencesData['start'] = new Date(
      preferences.result[0].slice(0, 10) + 'T'
       + preferences.result[0].slice(11, 19)
       );
    preferencesData['end'] = new Date(
      preferences.result[0].slice(0, 10) + 'T'
       + preferences.result[0].slice(20, 28)
       );
    if(preferences.result[1].average_preference === 3){
      preferencesData['title'] = "High Priority";
    }
    else if(preferences.result[1].average_preference === 2){
      preferencesData['title'] = "Medium Priority";
    }
    else{
      preferencesData['title'] = "Low Priority";
    }
  }
  const notifyAll = () => {
    fetch(`http://127.0.0.1:8000/accounts/email-contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      then: (response) => {
        if (!response.ok) {
          throw new Error("Failed to notify participants");
        }
        return response.json();
      },
      body: JSON.stringify({ calendar_id: id }),
    });
  };

  const [calendar, setCalendar] = useState([]); // State variable to store the calendar data
  const getCalendar = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch calendar data");
        }
        return response.json();
      })
      .then((data) => {
        setCalendar(data); // Update state variable with the fetched data
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
      });
  };
  useEffect(() => {
    getCalendar(); // Fetch calendar data on component mount
  }, []);
  const calendarData = {
    title: calendar.title,
    start: calendar.start_date,
    end: calendar.end_date,
  };

  return (
    <div>
      <Navbar />
      <div className="font-staatliches text-6xl leading-8 text-white text-center">
        {calendarData.title}
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          id="contact"
          className="text-white font-staatliches mt-11 ml-4 md:h-full border-none list-square text-left"
        >
          <h1 className="text-5xl ml-0 sm:text-center">PEOPLE</h1>

          <ul className="custom-list text-2xl mt-3 ml-8">
            {participants.map((participant) => (
              <div key={participant.id} className="ml-5 mb-5">
                {participant.username}
              </div>
            ))}
          </ul>

          <button
            className="login-button w-48 h-12 bg-white rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2"
            onClick={() => navigate(`/calendar_view/${id}/viewDetails`)}
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
              events={[preferencesData]}
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
          <button
            onClick={notifyAll}
            className="login-button w-48 h-12 bg-white mb-1 rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2 w-75px h-40px text-right sm:w-192px h-48px absolute"
          >
            NOTIFY ALL
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calendar_view;
