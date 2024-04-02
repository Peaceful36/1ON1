import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");
  //   const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.access) {
        setToken(res.access);
        localStorage.setItem("token", res.access);
        let headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${res.access}`,
        };

        const response2 = await fetch(
          "http://127.0.0.1:8000/accounts/get-user-details/",
          { headers }
        );
        const res2 = await response2.json();
        if (res2.id) {
          setUser(JSON.stringify(res2));
          localStorage.setItem("user", JSON.stringify(res2));
        } else {
          throw new Error(res2.message);
        }
        // navigate("/");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      setError(err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
