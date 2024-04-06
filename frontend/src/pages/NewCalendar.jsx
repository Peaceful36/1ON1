import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { useAuth } from "../helper/AuthProvider";
import { useParams, Link } from "react-router-dom";

function NewCalendarForm() {
    const { id } = useParams();
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
    });
    const [resultMessage, setResultMessage] = useState('');
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(JSON.stringify(formData));
          const response = await fetch('http://127.0.0.1:8000/calendars/create/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
    
          if (!response.ok) {
            throw new Error('Failed to add calendar');
          }
    
          const data = await response.json();
          setResultMessage("Success");
          // Clear form data
          setFormData({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
          });
        } catch (error) {
          setResultMessage(error.message);
        }
      };
    
    

    return (
        <>
            <Navbar />
            <h1 className="text-white text-6xl md:text-7xl font-staatliches text-center mt-4 md:my-5">New Calendar</h1>
            <div className="flex items-center justify-center p-12 px-[100px]">
                <div className="mx-auto w-3/5 custom-form-width">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                htmlFor="title"
                                className="text-xl mb-3 block text-base font-medium text-white font-staatliches"
                            >
                                Calendar Name
                            </label>
                            <input
                                type="text"
                                name="title"
                                onChange={handleChange}
                                id="title"
                                required
                                placeholder="Calendar Name"
                                className="w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="description"
                                className="text-xl mb-3 block text-base font-medium text-white font-staatliches"
                            >
                                Description
                            </label>
                            <textarea
                                rows="4"
                                name="description"
                                id="description"
                                onChange={handleChange}
                                placeholder="Type a description"
                                required
                                className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            ></textarea>
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="start_date"
                                className="text-xl mb-3 block text-base font-medium text-white font-staatliches"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                onChange={handleChange}
                                id="start_date"
                                required
                                className="w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="end_date"
                                className="text-xl mb-3 block text-base font-medium text-white font-staatliches"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                onChange={handleChange}
                                id="end_date"
                                required
                                className="w-full rounded-md border bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <Link to='/calendar' className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-auto">   
                                <button type="button" onClick={() => false} className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-auto hover:bg-gray-500 rounded-md bg-gray-400 py-3 px-8 text-base text-gray-900 outline-none font-staatliches">
                                    Cancel
                                    
                                </button>
                            </Link>
                            <button type="submit" className="w-full md:w-auto hover:bg-blue-800 rounded-md bg-blue-600 py-3 px-8 text-base text-white outline-none font-staatliches">
                                Submit
                            </button>
                        </div>
                        <p className="text-base text-center text-gray-400" id="result">{resultMessage}</p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default NewCalendarForm;
