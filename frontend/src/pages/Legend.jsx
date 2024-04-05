import React from 'react';

const Legend = () => {
  return (
    <div className=" flex gap-3 justify-center mt-5 sm:gap-10">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-red-500 mr-2"></div>
        <span className="text-white">High Priority</span>
      </div>
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-yellow-500 mr-2"></div>
        <span className="text-white">Medium Priority</span>
      </div>
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-green-500 mr-2"></div>
        <span className="text-white">Low Priority</span>
      </div>
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-pink-500 mr-2"></div>
        <span className="text-white">Suggested Time</span>
      </div>
    </div>
  );
};

export default Legend;
