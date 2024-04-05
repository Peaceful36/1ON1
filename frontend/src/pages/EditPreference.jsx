import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Alert, Stack } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from "../helper/AuthProvider";

function EditPreference() {
    const { cid, pid } = useParams();
    const { token, user } = useAuth();
    const location = useLocation(); // Use useLocation hook
    const preferenceState = location.state; // Access location state
    const date = location.state?.date;
    const start_time = location.state?.start_time;
    const end_time = location.state?.end_time;
    const priority = location.state?.priority;
    const [formData, setFormData] = useState({
        date: date,
        start_time: start_time,
        end_time: end_time,
        priority: priority,
    });
    const [calendarDates, setCalendarDates] = useState({
        start_date: '',
        end_date: '',
    });
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();
    const new_user = JSON.parse(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'end_time' && value < formData.start_time) {
            setShowError(true); // Show error message if end time is less than start time
            return;
        }
        setFormData({ ...formData, [name]: value });
        setShowError(false); // Hide error message if end time is greater than start time
    };
    useEffect(() => {   
        const fetchCalendarDates = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/calendars/${cid}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch calendar dates');
                }
                const data = await response.json();
                setCalendarDates({
                    start_date: data.start_date,
                    end_date: data.end_date,
                });
            } catch (error) {
                console.error('Error fetching calendar dates:', error);
            }
        };

        fetchCalendarDates();
    }, [cid, token]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/calendars/${cid}/preference/${pid}/edit/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to edit preference');
            }
            navigate(`/${cid}/preferences/${new_user.id}`);
        } catch (error) {
            console.error('Error editing preference:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-8">
                <h1 className="text text-6xl text-center mt-20 font-staatliches mt-10 text-white mb-10">Edit Preference</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label className="block text-white">Date:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} min={calendarDates.start_date} max={calendarDates.end_date} required className="bg-gray-200 rounded-md p-2 w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Start Time:</label>
                        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="bg-gray-200 rounded-md p-2 w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">End Time:</label>
                        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="bg-gray-200 rounded-md p-2 w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Priority:</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} required className="bg-gray-200 rounded-md p-2 w-full">
                            <option value="">Select Priority</option>
                            <option value="None">None</option>
                            <option value="High Priority">High Priority</option>
                            <option value="Medium Priority">Medium Priority</option>
                            <option value="Low Priority">Low Priority</option>
                        </select>
                    </div>
                    {showError && ( // Render error message if showError state is true
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert variant="filled" severity="error">
                                End time cannot be less than start time.
                            </Alert>
                        </Stack>
                    )}
                    <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded block mx-auto w-1/2 text-center mt-5">
                        Edit Preference
                    </button>
                </form>
            </div>
        </>
    );
}

export default EditPreference;
