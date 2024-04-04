import React, { useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from "../helper/AuthProvider";
import { useParams } from "react-router-dom";

function AddContact() {
  const { id } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    user: '',
    email: ''
  });
  const [resultMessage, setResultMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(JSON.stringify(formData));
      const response = await fetch('http://127.0.0.1:8000/accounts/add-contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add contact');
      }

      const data = await response.json();
      setResultMessage(data.detail);
      // Clear form data
      setFormData({
        user: '',
        email: ''
      });
    } catch (error) {
      setResultMessage(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center min-h-screen">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
            <div className="text-center">
              <h1 className="my-3 text-6xl font-semibold font-staatliches text-black">ADD CONTACT</h1>
              <p className="text-gray-400 font-staatliches">Fill up the form below to add as a contact.</p>
            </div>
            <div className="m-7">
              <form id="form" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-3xl text-black font-staatliches">Username</label>
                  <input type="text" name="user" id="user" placeholder="Type Username" value={formData.user} onChange={handleChange} required className="w-full px-1 py-2 ml-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-3xl text-black font-staatliches">Email Address</label>
                  <input type="email" name="email" id="email" placeholder="Type Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 ml-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                </div>
                <div className="mb-6">
                  <button type="submit" className="w-full px-3 py-4 text-2xl font-staatliches text-white bg-black rounded-md hover:bg-red-600 focus:outline-none">ADD CONTACT</button>
                </div>
                <p className="text-base text-center text-gray-400" id="result">{resultMessage}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContact;

