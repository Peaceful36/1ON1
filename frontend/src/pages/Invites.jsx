import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../helper/AuthProvider";

export default function Invites() {
  const { token, user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [invitationsUpdated, setInvitationsUpdated] = useState(false);

  const acceptInvite = async (cid, uid) => {
    const response = await fetch(
      `http://127.0.0.1:8000/calendars/${cid}/invite/${uid}/status/update/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Accepted" }),
      }
    );
    const result = await response.json();
    setInvitationsUpdated(!invitationsUpdated);
  };

  const declineInvite = async (cid, uid) => {
    const response = await fetch(
      `http://127.0.0.1:8000/calendars/${cid}/invite/${uid}/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    console.log(result);
    setInvitationsUpdated(!invitationsUpdated);
  };

  useEffect(() => {
    const getCalendar = async (cid) => {
      const response = await fetch(`http://127.0.0.1:8000/calendars/${cid}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        return result;
      }
    };
    const fetchInvites = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${
          JSON.parse(user).id
        }/invitations/all/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setInvitations(result);
        setCalendars(
          await Promise.all(
            result.map(
              async (invitation) => await getCalendar(invitation.calendar_id)
            )
          )
        );
      }
    };
    fetchInvites();
  }, [invitationsUpdated]);
  return (
    <>
      <Navbar />
      <h2 className="text text-6xl text-center mt-20 font-staatliches mt-10 text-white">
        Invites
      </h2>
      <div className="w-full max-w-md mb-7 p-4 mx-auto mt-32 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-staatliches text-4xl font-bold leading-none text-black">
            Pending Invitations
          </h5>
        </div>
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {invitations &&
              invitations.map((invitation, index) => (
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="font-staatliches text-2xl font-medium text-black truncate">
                        {calendars[index] && calendars[index].title}
                      </p>
                      <p
                        className={`font-staatliches text-xl text-gray-500 truncate `}
                      >
                        {calendars[index] && calendars[index].description}
                      </p>
                      <p
                        className={`font-staatliches text-xl text-gray-500 truncate `}
                      >
                        Status:{" "}
                        <span
                          className={`${
                            invitation.status === "Not Accepted"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {invitation.status}
                        </span>
                      </p>
                      <div className=" justify-between">
                        {invitation.status === "Not Accepted" ? (
                          <>
                            <a
                              href={false}
                              onClick={() =>
                                acceptInvite(
                                  calendars[index] ? calendars[index].id : 0,
                                  invitation.invitee
                                )
                              }
                              className="font-staatliches text-xl font-medium text-green-600 hover:underline mr-auto"
                            >
                              Accept
                            </a>
                            <a
                              href={false}
                              onClick={() =>
                                declineInvite(
                                  calendars[index] ? calendars[index].id : 0,
                                  invitation.invitee
                                )
                              }
                              className="font-staatliches text-xl font-medium text-red-600 hover:underline ml-2"
                            >
                              Decline
                            </a>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
