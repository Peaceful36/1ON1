import React from "react";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div className=" overflow-hidden">
      <Navbar />
      <div className="items-center">
        <h2 className="text text-6xl text-center font-staatliches mt-10 ml-4 text-red-500">
          404 Page Not Found
        </h2>
      </div>
    </div>
  );
}
