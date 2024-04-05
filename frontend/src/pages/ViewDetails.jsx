import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MoreDetailsUserCard from "../components/MoreDetailsUserCard";
import { useParams } from "react-router-dom";
import { useAuth } from "../helper/AuthProvider";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

export default function ViewDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [participants, setParticipants] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [calendarUpdate, setCalendarUpdate] = useState(false);

  const addtoCalendar = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/calendars/${id}/invite/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invitee: searchValue.id }),
      }
    );
    if (response.ok) {
      const result = await response.json();
      setCalendarUpdate(!calendarUpdate);
      setSearchValue(null);
    }
  };

  const removeFromCalendar = async (uid) => {
    const response = await fetch(
      `http://127.0.0.1:8000/calendars/${id}/invite/${uid}/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const result = await response.json();
      setCalendarUpdate(!calendarUpdate);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const participantsResponse = await fetch(
        `http://127.0.0.1:8000/calendars/${id}/participants/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (participantsResponse.ok) {
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);

        const contactsResponse = await fetch(
          `http://127.0.0.1:8000/accounts/get-contacts/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          const formattedContacts = contactsData.contacts
            .filter(
              (contact) =>
                !participantsData.some(
                  (participant) => participant.id === contact.contact_user
                )
            )
            .map((contact) => ({
              label: contact.contact_user_username,
              id: contact.contact_user,
            }));

          setContacts(formattedContacts);
        }
      }
    };
    fetchData();
  }, [id, token, calendarUpdate]); // Add id and token to the dependencies array

  return (
    <div>
      <Navbar />
      <h2 className="text text-6xl text-center font-staatliches mt-10 ml-4 text-white">
        PEOPLE
      </h2>
      <div className="flex items-center justify-center w-1/3 h-full ml-auto mr-auto">
        <Autocomplete
          disablePortal
          value={searchValue}
          onChange={(event, newValue) => {
            console.log(newValue);
            setSearchValue(newValue);
          }}
          options={contacts}
          isOptionEqualToValue={(option, value) => option.label === value}
          sx={{
            width: "40rem",
            fontSize: "text-sm",
            border: "white",
            borderRadius: "full",
            "& .MuiInputBase-root": {
              color: "white",
              // background: "white",
              borderRadius: "100px",
            },
            "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
              borderRadius: "100px",
              width: 1,
            },
            // background: "white",
            // border: "black",
            // "& .MuiOutlinedInput-root": {
            //   borderRadius: "full", // Set border radius for the input root
            //   "&:hover .MuiOutlinedInput-notchedOutline": {
            //     text: "white",
            //     borderRadius: "full",
            //   },
            //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            //     color: "white",
            //   },
            // },
          }}
          renderInput={(params) => (
            <TextField
              // label="Search Contacts"
              color="error"
              focused
              placeholder="Search Contacts"
              {...params}
            />
          )}
        />
      </div>
      <div className="ml-auto mr-auto text-right w-1/3 mt-3">
        {searchValue && (
          <Button variant="contained" color="error" onClick={addtoCalendar}>
            Add to Calendar
          </Button>
        )}
      </div>

      {participants &&
        participants.map((user, index) => (
          <div className="container w-full max-w-sm mx-auto mt-16 bg-white border border-gray-200 rounded-lg shadow font-staatliches">
            <MoreDetailsUserCard
              cid={id}
              participant={user}
              // status={status ? status[index].status : "Null"}
              removeFromCalendar={removeFromCalendar}
            />
          </div>
        ))}
    </div>
  );
}
