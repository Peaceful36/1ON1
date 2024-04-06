import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Calendars from "./pages/Calendars";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";

import AuthProvider from "./helper/AuthProvider";
import ProtectedRoute from "./helper/ProtectedRoute";
import Calendar_view from "./pages/Calendar_view";
import NewCalendarForm from "./pages/NewCalendar";
import EditCalendar from "./pages/EditCalendar";
import ViewDetails from "./pages/ViewDetails";
import CreatePreference from "./pages/createPreference";
import Preferences from "./pages/Preferences";
import EditPreference from "./pages/EditPreference";


function App(children) {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/calendar" element={<Calendars />} />
            <Route path="/addcalendar" element={<NewCalendarForm />} />
            <Route path="/editcalendar" element={<EditCalendar />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invites" element={<Invites />} />
            <Route path="/editcontact" element={<EditContact />} />
            <Route path="/addcontact" element={<AddContact />} />
            <Route path="/calendar_view/:id" element={<Calendar_view />} />
            <Route
              path="/calendar_view/:id/viewDetails"
              element={<ViewDetails />}
            ></Route>
            <Route path="/create-preference/:cid" element={<CreatePreference />} />
            <Route path="/:cid/preferences/:id" element={<Preferences />} />
            <Route path="/:cid/preferences/:pid/edit" element={<EditPreference />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
