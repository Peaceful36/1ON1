import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { Link } from 'react-router-dom';
import { useAuth } from '../helper/AuthProvider';
import { useParams } from 'react-router-dom';

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);
  const { id } = useParams();
  const { token } = useAuth();

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/get-contacts/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data.contacts);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Get current contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (contactId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/accounts/delete-contact/${contactId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      // Update contacts state after deletion
      const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
      setContacts(updatedContacts);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <h2 className="text text-6xl text-center mt-20 font-staatliches mt-10 text-white">CONTACTS</h2>
      <div className="w-full max-w-md mb-7 p-4 mx-auto mt-32 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-staatliches text-4xl font-bold leading-none text-black">CONTACTS</h5>
          <Link to="/addcontact" className="font-staatliches text text-xl font-medium text-red-600 hover:underline">
            ADD CONTACT
          </Link>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentContacts.map((contact, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="font-staatliches text-2xl font-medium text-black truncate">
                      {contact.contact_user_username}
                    </p>
                    <p className="font-staatliches text-xl text-gray-500 truncate ">{contact.contact_user_email}</p>
                    <a
                      className="font-staatliches text-xl font-medium text-red-600 hover:underline"
                      onClick={() => handleDelete(contact.contact_user)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Pagination */}
        <nav className="mt-4 flex justify-center">
          <ul className="flex pl-0 list-none rounded my-2">
            {Array.from({ length: Math.ceil(contacts.length / contactsPerPage) }).map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`font-staatliches text-xl font-medium mx-1 px-3 py-1 ${
                    currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'
                  } hover:bg-gray-300 hover:text-gray-700`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Contact;
