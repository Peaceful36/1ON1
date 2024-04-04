import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MoreDetailsUserCard from "../components/MoreDetailsUserCard";
import { useParams } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";

export default function ViewDetails() {
  const theme = useTheme();
  const { id } = useParams();
  const { token } = useAuth();
  const [participants, setParticipants] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const getParticipants = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${id}/participants/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setParticipants(result);
      }
    };
    const getContacts = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/accounts/get-contacts/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const results = await response.json();

        const formattedResult = [];
        results.contacts.forEach((contact) => {
          formattedResult.push({ label: contact.contact_user_username });
        });
        setContacts(formattedResult);
      }
    };
    getContacts();
    getParticipants();
  }, []);

  return (
    <div>
      <Navbar />
      <h2 className="text text-6xl text-center font-staatliches mt-10 ml-4 text-white">
        PEOPLE
      </h2>
      <div className="flex items-center justify-center w-1/3 h-full ml-auto mr-auto">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={contacts}
          sx={{
            width: "40rem",
            fontSize: "text-sm",
            borderRadius: "full",
            background: theme.palette.background.default,
            "& .MuiOutlinedInput-root": {
              borderRadius: "full", // Set border radius for the input root
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none", // Remove border on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none", // Remove border on focus
              },
            },
          }}
          renderInput={(params) => (
            <TextField {...params} className=" w-1 border rounded-full" />
          )}
        />
      </div>

      {participants &&
        participants.map((user) => (
          <div className="container w-full max-w-sm mx-auto mt-16 bg-white border border-gray-200 rounded-lg shadow">
            <MoreDetailsUserCard participant={user} />
          </div>
        ))}
    </div>
  );
}
