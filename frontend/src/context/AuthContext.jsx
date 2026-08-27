import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      const userData = result.data.user;
      const token = result.data.token;

      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("token", token);

      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login error:", error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const loginWithToken = async (token) => {
    setLoading(true);

    try {
      localStorage.setItem("token", token);

      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to get user");
      }

      const userData = result.data.user;

      localStorage.setItem(
        "authUser",
        JSON.stringify(userData)
      );

      setUser(userData);

      return true;
    } catch (error) {
      console.error("Google login error:", error.message);

      localStorage.removeItem("token");
      localStorage.removeItem("authUser");

      setUser(null);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Registration failed"
        );
      }

      const userData = result.data.user;
      const token = result.data.token;

      localStorage.setItem(
        "authUser",
        JSON.stringify(userData)
      );

      localStorage.setItem("token", token);

      setUser(userData);

      return true;
    } catch (error) {
      console.error(
        "Registration error:",
        error.message
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);

    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  // =========================
  // RESTORE USER
  // =========================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Failed to restore user:",
        error
      );

      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = user !== null;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    loginWithToken,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };