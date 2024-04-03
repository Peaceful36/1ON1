import React from "react";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";

export default function MoreDetailsUserCard(props) {
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
            <MenuItem className="px-2 py-2 hover:bg-gray-100 w-full cursor-pointer">
              Edit
            </MenuItem>
            <MenuItem className="px-2 py-2 hover:bg-gray-100 w-full text-red-500 cursor-pointer">
              Delete
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10">
        <h5 className="text mb-1 text-4xl font-medium text-gray-900 ">
          {props.participant.username}
        </h5>
        <span className="text text-xl text-gray-500 ">
          {props.participant.first_name} {props.participant.last_name}
        </span>
        <div className="flex mt-4 md:mt-6">
          <a className="text inline-flex items-center px-4 py-2 text-xl font-medium text-center text-white bg-black rounded-lg hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-black ">
            Email
          </a>
          <a className="text inline-flex items-center px-4 py-2 text-xl font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-black ">
            Add to Project
          </a>
        </div>
      </div>
    </div>
  );
}
