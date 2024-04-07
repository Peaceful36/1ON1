import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Preferences() {
  const [preferences, setPreferences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const preferenceState = location.state;
  const [refresh, setRefresh] = useState(1); // Initialize 'refresh' state to 1
  const PreferencesPerPage = 2;
  const indexofLastPreference = currentPage * PreferencesPerPage;
  const indexofFirstPreference = indexofLastPreference - PreferencesPerPage;
  const currentPreferences = preferences.slice(
    indexofFirstPreference,
    indexofLastPreference
  );
  const totalPages = Math.ceil(preferences.length / PreferencesPerPage);
  const { cid, id } = useParams();
  const { token, user } = useAuth();
  const new_user = JSON.parse(user);
  const navigate = useNavigate();

  // Function to fetch preferences
  const fetchPreferences = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${cid}/preferences/${id}/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 404) {
        // const nav = Navigate();
        navigate("/not_found");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  // Call fetchPreferences initially and whenever 'id', 'token', or 'refresh' state changes
  useEffect(() => {
    fetchPreferences();
  }, [id, token, refresh]);

  // Function to handle deleting a preference
  const handleDeletePreference = async (preferenceId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${cid}/preference/${preferenceId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete preference");
      }
      // Set refresh to trigger re-render and fetch updated preferences
      setRefresh(refresh + 1);
    } catch (error) {
      console.error("Error deleting preference:", error);
    }
  };

  // Pagination functions
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  // Check if the current page becomes empty after deleting a preference

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text text-6xl text-center mt-20 font-staatliches mt-10 text-white mb-10">
          Preferences
        </h1>
        {new_user.id === parseInt(id) ? (
          <Link
            to={`/create-preference/${cid}`}
            className="text text-2xl bg-red-500 hover:bg-red-700 font-staatliches text-white font-bold py-2 px-3 rounded-full mt-4 block mx-auto w-1/2 text-center mb-20"
          >
            Create New Preference
          </Link>
        ) : null}
        <div className="grid grid-cols-3 gap-4">
          {currentPreferences.map((preference) => (
            <div key={preference.id} className="bg-gray-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-center mb-4">
                Preference {preference.id}
              </h2>
              <p className="text-center">User: {preference.user}</p>
              <p className="text-center">Date: {preference.date}</p>
              <p className="text-center">Start Time: {preference.start_time}</p>
              <p className="text-center">End Time: {preference.end_time}</p>
              <p className="text-center">Priority: {preference.priority}</p>
              <div className="flex justify-center mt-4">
                {new_user.id === parseInt(id) ? (
                  <Link
                    to={`/${cid}/preferences/${preference.id}/edit`}
                    state={{
                      date: preference.date,
                      start_time: preference.start_time,
                      end_time: preference.end_time,
                      priority: preference.priority,
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                  >
                    Edit
                  </Link>
                ) : null}
                {new_user.id === parseInt(id) ? (
                  <button
                    onClick={() => handleDeletePreference(preference.id)} // Implement handleDeletePreference function
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Preferences;
