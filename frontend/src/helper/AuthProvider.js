import { useContext, createContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(Cookies.get("user") || null);
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [error, setError] = useState("");

  const now = new Date();
  const expires = new Date(now.getTime() + 3600 * 1000);

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
      if (!response.ok) {
        setError(res.error);
        return res.error;
      }
      if (res.access) {
        setToken(res.access);
        Cookies.set("token", res.access, { expires });
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
          Cookies.set("user", JSON.stringify(res2), { expires });
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
    Cookies.remove("token");
    Cookies.remove("user");
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
