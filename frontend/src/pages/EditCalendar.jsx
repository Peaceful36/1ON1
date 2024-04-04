import React, { useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';


function EditCalendar(props) {
    const { token } = useAuth();
    const location = useLocation();
    
    const id = location.state?.id;
    const title = location.state?.title;
    const description = location.state?.description;
    console.log(id, title, description)



    // const { title, description, id } = location.state;
    const [formData, setFormData] = useState({
        title: title || '',
        description: description || '',
    });


    const [resultMessage, setResultMessage] = useState('');
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(JSON.stringify(formData));
          const response = await fetch(`http://127.0.0.1:8000/calendars/${id}/edit/`, {
            method: 'PUT',
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
          setFormData({
            title: '',
            description: '',
          });
        } catch (error) {
          setResultMessage(error.message);
        }
      };
    
    

    return (
        <>
            <Navbar />
            <h1 className="text-white text-6xl md:text-7xl font-staatliches text-center mt-4 md:my-5">Edit Calendar</h1>
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
                                // placeholder={formData.title}
                                value={formData.title}
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
                                value={formData.description}
                                required
                                className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            ></textarea>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <button type="button" onClick={() => false} className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-auto hover:bg-gray-500 rounded-md bg-gray-400 py-3 px-8 text-base text-gray-900 outline-none font-staatliches">
                                Cancel
                            </button>
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

export default EditCalendar;
