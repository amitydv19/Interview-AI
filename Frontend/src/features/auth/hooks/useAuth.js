import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
            setLoading(true);
        try {
            const data = await login({ email, password });

            localStorage.setItem("token", data.token);
            setUser(data.user);

            return true; // ✅ IMPORTANT
        } catch (err) {
            console.error("Login Error:", err);
            return false; // ✅ IMPORTANT
        } finally {
            setLoading(false);
    }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (err) {
            console.error("Register Error:", err);
        } finally {
            setLoading(false); // ❗ moved here
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        setLoading(false);
        return;
    }

    const getAndSetUser = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (err) {
      console.error("GetMe Error:", err);
      localStorage.removeItem("token");
      setUser(null); // ✅ explicitly reset
    } finally {
      setLoading(false);
    }
  };

  getAndSetUser();
}, []);


    return { user, loading, handleRegister, handleLogin, handleLogout };
};
