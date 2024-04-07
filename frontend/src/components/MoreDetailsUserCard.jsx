import React, { useEffect, useState } from "react";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";
import { useAuth } from "../helper/AuthProvider";
import { Link } from "react-router-dom";

export default function MoreDetailsUserCard(props) {
  const { token } = useAuth();
  const [status, setStatus] = useState(null);
  console.log(props.participant);
  useEffect(() => {
    const getStatus = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/${props.cid}/invite/${props.participant.id}/status/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status===404){
        setStatus(false)
      }
      if (response.ok) {
        const result = await response.json();
        setStatus(result.status);
      }
    };
    getStatus();
  }, []);
  return (
    <div>
      <div className=" text-right mr-4 mt-3">
        <Dropdown>
          <MenuButton className="">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="https://www.w3.org/TR/SVG2/"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </MenuButton>
          <Menu className="container w-[90px] max-w-sm mx-auto mt-2 ml-[-20px] h-auto max-h-sm bg-white border border-gray-200 rounded-lg shadow">
            {/* <MenuItem className="px-2 py-2 hover:bg-gray-100 w-full cursor-pointer">
              Edit
            </MenuItem> */}
            {props.isUser ? (
              <MenuItem
                onClick={() => props.removeFromCalendar(props.participant.id)}
                className="px-2 py-2 hover:bg-gray-100 w-full text-green-500 cursor-pointer"
              >
              </MenuItem>
            ) :  status && (
              <MenuItem
                onClick={() => props.removeFromCalendar(props.participant.id)}
                className="px-2 py-2 hover:bg-gray-100 w-full text-red-500 cursor-pointer"
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10 relative">
        <h5 className="text mb-1 text-4xl font-medium text-gray-900">
          {props.participant.username}
        </h5>
        <span className="text text-md text-gray-500">
          {props.participant.first_name}
          {props.participant.last_name}
        </span>

        <div className="flex mt-4 md:mt-6 mb-2">
          <Link
            to={`/${props.cid}/preferences/${props.participant.id}`}
            className="text inline-flex items-center px-4 py-2 text-xl font-medium text-center text-white bg-black rounded-lg hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-black"
          >
            Preferences
          </Link>
        </div>
        { status &&
          <span className="absolute bottom-0 left-0 text text-md font-bold text-gray-500 ml-2 mb-2">
            Status: <span className="text-red-500 font-medium">{status}</span>
          </span>
        }
      </div>
    </div>
  );
}
