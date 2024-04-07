import * as React from "react";
import Navbar from "../components/Navbar";
import Legend from "../components/Legend";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "./Calendar.css";
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";

const localizer = dayjsLocalizer(dayjs);

function Calendar_view() {
  const [preferences, setPreferences] = useState([]);

  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { token } = useAuth(); // Get the authentication token using the useAuth hook

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const getEvents = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}/preferences/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 404) {
          // const nav = Navigate();
          navigate("/not_found");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data); // Update state variable with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };
  useEffect(() => {
    getEvents(); // Fetch events on component mount
  }, []);
  const eventData = events.map((event) => ({
    start: new Date(event.date + "T" + event.start_time),
    end: new Date(event.date + "T" + event.end_time),
    title: event.priority,
  }));
  const handleAutoGen = () => {
    fetch(`http://127.0.0.1:8000/calendars/${id}/generate`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Cannot auto-generate preferences.");
          throw new Error("Failed to fetch preferences");
        }
        return response.json();
      })
      .then((data) => {
        setPreferences(data); // Update state variable with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
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

  const notifyAll = () => {
    fetch(`http://127.0.0.1:8000/accounts/email-contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      then: (response) => {
        if (!response.ok) {
          throw new Error("Failed to notify participants");
        }
        alert("Notified all participants");
        return response.json();
      },
      body: JSON.stringify({
        subject: "Reminder:" + calendar.title,
        body: "You have an event coming up!",
        contacts: [2],
      }),
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
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
      });
  };
  useEffect(() => {
    getCalendar(); // Fetch calendar data on component mount
  }, []);
  if (preferences.result !== undefined) {
    eventData.push({
      start: new Date(
        preferences.result[0].slice(0, 10) +
          "T" +
          preferences.result[0].slice(11, 19)
      ),
      end: new Date(
        preferences.result[0].slice(0, 10) +
          "T" +
          preferences.result[0].slice(20, 28)
      ),
      title: "Suggested",
    });

    // check if suggested
  }

  console.log(eventData);
  useEffect(() => {
    getEvents(); // Fetch events on component mount
  }, []);
  return (
    <div>
      <Navbar />

      <h1 className="font-staatliches text-4xl text-white text-center ml-0 ml-4 sm:text-center text-6xl">
        {calendar.title}
      </h1>
      <Legend />
      <div className="flex flex-col md:flex-row">
        <div
          id="contact"
          className="text-white font-staatliches mt-11 ml-4 md:h-full border-none list-square text-left"
        >
          <div className="text-3xl ml-0 sm:text-center text-5xl">PEOPLE</div>

          <ul className="custom-list text-2xl mt-3 ml-8">
            {participants.slice(0, 8).map((participant) => (
              <div key={participant.id} className="sm:ml-5 mb-5">
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
          className="bg-white rounded-md w-3/4 shadow-md mt-10 ml-0 text-sm sm:ml-24 text-base sm:text-center"
        >
          <div>
            <Calendar
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              className="text-center"
              events={eventData}
              eventPropGetter={
                (event) => {
                  let newStyle = {
                    color: "black",
                    backgroundColor: "lightgray"
                  };
                  if (event.title === "High Priority") {
                    newStyle.backgroundColor = "red";
                    newStyle.color = "transparent";
                    //hide the text
                  }
                  if (event.title === "Medium Priority") {
                    newStyle.backgroundColor = "yellow";
                    newStyle.color = "transparent";

                  }
                  if (event.title === "Low Priority") {
                    newStyle.backgroundColor = "green";
                    newStyle.color = "transparent";

                  }
                  if (event.title === "Suggested"){
                    newStyle.backgroundColor = "pink";
                    newStyle.color = "transparent";

                  }
            
                  return {
                    style: newStyle
                  };
                }
              }
              views = {['month', 'week', 'day']}
              // views = {{agenda: EventAgenda}}
            />
          </div>
          <button
            onClick={handleAutoGen}
            className="login-button w-48 h-12 bg-white mb-1 rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2 w-75px h-40px text-center sm:w-192px h-48px"
          >
            AUTO-GENERATE
          </button>
          <button
            onClick={notifyAll}
            className="login-button w-48 h-12 bg-white mb-1 rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2 w-75px h-40px text-center sm:w-192px h-48px"
          >
            NOTIFY ALL
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calendar_view;
