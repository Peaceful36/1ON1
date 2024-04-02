import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import Calendars from './pages/Calendars';
import Login from './pages/Login'; 
import Register from './pages/Register';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import Calendar_view from './pages/Calendar_view';


function App(children) {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/calendar" element={<Calendars />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editcontact" element={<EditContact />} />
        <Route path="/addcontact" element={<AddContact />} />
        <Route path="/calendar_view" element={<Calendar_view />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
