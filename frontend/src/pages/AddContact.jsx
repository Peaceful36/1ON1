import React from 'react'
import Navbar from './Navbar'
function AddContact() {
  return (
    <div>
        <Navbar />
        <div className="flex items-center min-h-screen  ">
            <div className="container mx-auto">
                <div className="max-w-3xl mx-auto my-10 bg-white  p-5 rounded-md shadow-sm">
                    <div className="text-center">
                        <h1 className="text my-3 text-6xl font-semibold font-staatliches text-black ">ADD CONTACT</h1>
                        <p className="text text-gray-400 font-staatliches ">Fill up the form below to add as a contact.</p>
                    </div>
                    <div className="m-7">
                        <form id="form">

                            <input type="hidden" name="apikey" value="YOUR_ACCESS_KEY_HERE" />
                            <input type="hidden" name="subject" value="New Submission from Web3Forms" />
                            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                            <div className="mb-6">
                                <label htmlFor="name" className="text block mb-2 text-3xl text-black font-staatliches">Full Name</label>
                                <input type="text" name="name" id="name" placeholder="Ohda Jack" required className="text w-full px-1 py-2 ml-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 " />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="text block mb-2 text-3xl text-black font-staatliches">Email Address</label>
                                <input type="email" name="email" id="email" placeholder="ohda@gmail.com" required className="text w-full px-3 py-2 ml-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 " />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="phone" className="text text-3xl text-black font-staatliches">Phone Number</label>
                                <input type="text" name="phone" id="phone" placeholder="+1 (647) 234-567" required className="text w-full px-3 py-2 ml-1 mb-5 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 " />
                            </div>
                            <div className="mb-6">
                                <button type="submit" className="text w-full px-3 py-4 font-staatliches text-white text-2xl bg-black rounded-md hover:bg-red-600 focus:outline-none" onClick={() => false}>ADD CONTACT</button>
                            </div>
                            <p className="text-base text-center text-gray-400" id="result"></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default AddContact