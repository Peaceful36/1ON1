import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'


function Contact() {
  const data = [
    {
      "name" : "nipun",
      "email" : "nipun@gmail.com"
    },
    {
      "name" : "inaam",
      "email" : "inaam@gmail.com"
    }

  ]
  return (
    <div>
      <Navbar />
      <h2 class="text text-6xl text-center mt-20 font-staatliches mt-10 text-white">CONTACTS</h2>
      <div className="w-full max-w-md mb-7 p-4 mx-auto mt-32 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-staatliches text-4xl font-bold leading-none text-black">CONTACTS</h5>
          <Link to="/addcontact" className="font-staatliches text text-xl font-medium text-red-600 hover:underline">
              ADD CONTACT
          </Link>
        </div>
        <div className='flow-root'>
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((contact, index) => (
              <li key={index} className="py-3 sm:py-4">
                  <div className="flex items-center">
                      <div className="flex-1 min-w-0 ms-4">
                          <p className="font-staatliches text-2xl font-medium text-black truncate">
                              {contact.name}
                          </p>
                          <p className="font-staatliches text-xl text-gray-500 truncate ">
                              {contact.email}
                          </p>
                          <Link to={{
                                      pathname: "/editcontact",
                                      search: `?name=${contact.name}&email=${contact.email}`,
                                  }}
                                  className="font-staatliches text-xl font-medium text-red-600 hover:underline">
                              Edit
                          </Link>
                      </div>
                  </div>
              </li>
          ))}
          </ul>

        </div>
      </div>
    </div>
  )
}

export default Contact