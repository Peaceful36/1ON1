import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; // Import useHistory hook

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useHistory hook

  const validatePassword = () => {
    if (password1 !== password2) {
      setError("Passwords do not match");
      return false;
    }
    if (password1.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/\d/.test(password1)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password1)) {
      setError("Password must contain at least one symbol");
      return false;
    }
    setError("");
    return true;
  };
  const handleFormSubmission = async (event) => {
    event.preventDefault()

    if(!validatePassword()){
      return ;
    }
    
    fetch("http://127.0.0.1:8000/accounts/register/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": username,
      "email": email,
      "password": password1})
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Redirect to login page after successful registration
      navigate("/login");
    })
    .catch(error => setError(error));
  }
    return (
      <>
        <Navbar />
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=red&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-5xl font-bold leading-9 tracking-tight text-white font-staatliches">
              Register
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleFormSubmission}>
              <div>
              <label htmlFor="email" className="block text-2xl font-medium leading-6 text-white font-staatliches">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="uname"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label htmlFor="email" className="mt-4 block text-2xl font-medium leading-6 text-white font-staatliches">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-2xl font-medium leading-6 text-white font-staatliches">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password1"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="confrim password" className="block text-2xl font-medium leading-6 text-white font-staatliches">
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password2"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 duration-100 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Register
                </button>
              </div>
            </form>

          </div>
        </div>
      </>
    )
  }
  