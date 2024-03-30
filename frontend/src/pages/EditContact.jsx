import React from 'react'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom';


function EditContact() {
    const location = useLocation();
    console.log(location);
    // const contact = location.state?.contact;
    

    // // Assuming you have state variables to store name and email
    // const [name, setName] = React.useState(contact?.name || '');
    // const [email, setEmail] = React.useState(contact?.email || '');
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';

    // State to hold the input field values
    const [editedName, setEditedName] = React.useState(name);
    const [editedEmail, setEditedEmail] = React.useState(email);

    
    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEditedEmail(e.target.value);
    };

  return (
    <div>
        <Navbar />
        <h1 class="text-white text-6xl md:text-7xl font-staatliches text-center my-5">Edit Contact</h1>
        <div className="flex items-center justify-center p-12 px-[100px]">
            <div className="mx-auto w-1/2 custom-form-width">
                <form action="" method="POST">
                    <div className="mb-5">
                        <label htmlFor="name" className="text-xl mb-3 block text-base font-staatliches text-white">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={editedName}
                            onChange={handleNameChange}
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="text-xl mb-3 block text-base font-staatliches text-white">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={editedEmail} 
                            onChange={handleEmailChange}
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="note" className="text-xl mb-3 block text-base text-white font-staatliches">
                            Note
                        </label>
                        <input
                            type="text"
                            name="note"
                            id="note"
                            placeholder="Enter your note"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <button onClick={() => false} className="w-full md:w-auto mb-2 md:mb-0 mr-0 md:mr-auto hover:bg-gray-500 rounded-md bg-gray-400 py-3 px-8 text-base text-gray-900 outline-none font-staatliches">
                            Cancel
                        </button>
                        <button onClick={() => false} className="w-full md:w-auto hover:bg-blue-800 rounded-md bg-red-600 py-3 px-8 text-base text-white outline-none font-staatliches">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>


    </div>
  )
}

export default EditContact