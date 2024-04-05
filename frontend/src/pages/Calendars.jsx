import * as React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";

function Calendars() {
  const [calendars, setCalendars] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filteredCalendars, setFilteredCalendars] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const calendarsPerPage = 5;
  const totalPages = Math.ceil(filteredCalendars.length / calendarsPerPage);

  const fetchUsername = async (uid) => {
    const response = await fetch(
      `http://127.0.0.1:8000/accounts/get-details/${uid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();

    if (response.ok) {
      return result.username;
    }
    return "";
  };

  const fetchCalendars = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/calendars/all/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch calendars");
      }

      const data = await response.json();
      setCalendars(data);
      setOwners(
        await Promise.all(
          data.map(async (calendar) => {
            const result = await fetchUsername(calendar.owner);
            return result;
          })
        )
      );
      setFilteredCalendars(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    const results = calendars.filter((calendar) =>
      calendar.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCalendars(results);
  }, [searchTerm, calendars]);

  const handleDelete = async (calendar_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${calendar_id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete calendar");
      }

      // Update calendars state after deletion
      const updatedCalendars = calendars.filter(
        (calendar) => calendar.id !== calendar_id
      );
      setCalendars(updatedCalendars);
      setFilteredCalendars(updatedCalendars);
    } catch (error) {
      console.error("Error deleting calendar:", error.message);
    }
  };

  const indexOfLastCalendar = currentPage * calendarsPerPage;
  const indexOfFirstCalendar = indexOfLastCalendar - calendarsPerPage;
  const currentCalendars = filteredCalendars.slice(
    indexOfFirstCalendar,
    indexOfLastCalendar
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <h1 className="text-white text-7xl font-staatliches text-center my-5">
        Calendars
      </h1>

      {/* component */}
      <div className="flex items-center justify-center my-10">
        <div className="flex w-full pl-5 pr-2 md:px-0 md:w-1/3 md:mx-10 rounded-3xl">
          <input
            className="w-full h-12 rounded-3xl px-4 py-1 text-gray-400 outline-none focus:outline-none"
            type="search"
            name="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/addcalendar">
          <div className="md:hidden bg-red-500 text-black font-bold w-14 h-12 rounded-xl flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Calendar Cards */}
      <div className="relative flex flex-col justify-center md:py-6 mb-4">
        <div className="flex flex-col items-center mx-auto max-w-screen-lg">
          <div className="grid w-full gap-10 grid-cols-1 md:grid-cols-3 px-5 md:px-0">
            {/* New Calendar Card Component */}
            <Link
              to="/addcalendar"
              className="hover:bg-gray-500 cursor-pointer w-full rounded-lg shadow-md md:flex flex-col transition-all overflow-hidden hover:shadow-2xl border-dotted border-2 border-gray-300"
            >
              <div className="my-auto p-6 flex flex-col items-center justify-center">
                <div className="my-auto mx-auto p-6 flex items-center justify-center">
                  {/* Plus icon */}
                  <div className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-white font-staatliches text-lg">
                    New Calendar
                  </span>
                </div>
              </div>
            </Link>
            {currentCalendars.map((cal, index) => (
              <div
                key={index}
                className="bg-white w-full rounded-lg shadow-md flex flex-col transition-all overflow-hidden hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="pb-2 mb-4 border-b border-stone-200 text-sm font-medium flex justify-between font-staatliches">
                    <span className="flex items-center gap-1 custom-blue">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      {cal.start_date}
                    </span>
                    <p className="text-sm mb-0 font-staatliches overflow-clip max-w-30">
                      {owners[index] && owners[index].length > 50
                        ? `${owners[index].slice(0, 50)}...`
                        : owners[index]}
                    </p>
                  </div>
                  <h3 className="mb-4 font-semibold text-2xl font-staatliches">
                    <Link
                      to={`/calendar_view/${cal.id}`}
                      className="custom-hover custom-blue font-staatliches hover:text-[#F44336]"
                    >
                      {cal.title}
                    </Link>
                  </h3>
                  <p className="text-sm mb-0 font-staatliches">
                    {cal.description}
                  </p>

                  <div className="flex">
                    <Link
                      to="/editcalendar"
                      state={{
                        title: cal.title,
                        description: cal.description,
                        id: cal.id,
                      }}
                      className="text-md mb-0 text-red-400 font-staatliches hover:underline"
                    >
                      EDIT
                    </Link>
                    <p
                      className="text-md mb-0 ml-3 text-red-400 font-staatliches hover:underline"
                      onClick={() => handleDelete(cal.id)}
                    >
                      DELETE
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className="px-3 py-1 m-2 bg-black text-white rounded-md font-staatliches"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default Calendars;
