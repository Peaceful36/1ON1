import React from 'react'
import Navbar from './Navbar'

function Calendar_view() {
  return (
    <div>
      <Navbar />
      <div className="font-staatliches text-6xl leading-8 text-white text-center">
        My Calendar
      </div>

      <div className="flex flex-col md:flex-row">
        <div id="contact" className="text-white font-staatliches mt-11 ml-4 md:h-full bg-black border-none list-square text-left">
          <h1 className="text-5xl text-center">PEOPLE</h1>
          <ul className="custom-list text-2xl mt-3 ml-8">
            <div className="ml-5 mb-5">Inaam</div>
            <div className="ml-5 mb-5">Nipun</div>
            <div className="ml-5 mb-5">Noel</div>
            <div className="ml-5 mb-5">Hoa</div>
          </ul>
          <button className="login-button w-48 h-12 bg-white rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2" 
          onClick={() => window.location='moreDetails.html'}>MORE DETAILS</button>
        </div>

        <div id="calendar" className="bg-black rounded-md shadow-md mt-10 ml-0 text-sm sm:ml-24 text-base">
          <h2 className="md:text-2xl text-white mb-4 font-staatliches">February 2024</h2>

          <ul id="weeks" className="grid min-w-16 text-1.5xl grid-cols-7 font-staatliches text-center text-white mb-3">
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Sun</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Mon</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Tue</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Wed</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Thu</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Fri</div>
            <div className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-10">Sat</div>
          </ul>

          <ul id="days" className="grid min-w-16 text-1.5xl grid-cols-7 font-staatliches text-white flex items-end">
            {[...Array(31).keys()].map(day => (
              <div key={day} className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-20">{day === 0 ? '' : day}</div>
            ))}
            {[...Array(4).keys()].map(index => (
              <div key={`extra-${index}`} className="grid border-2 bg-gray-400 text-center w-75px h-40px sm:w-36 h-20"></div>
            ))}
          </ul>

          <button className="login-button justify-end w-48 h-12 bg-white rounded-full transform rotate-0.12 text-black font-staatliches font-normal text-3xl leading-12 mt-2">AUTO-GENERATE</button>
        </div>
      </div>
    </div>
  )
}

export default Calendar_view