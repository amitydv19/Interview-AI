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

        localStorage.setItem("token", data.token); // ✅ ADD THIS
        setUser(data.user);

    } catch (err) {
        console.error("Login Error:", err);
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

        const getAndSetUser = async () => {
    try {
        console.log("Calling getMe...");
        const data = await getMe();
        console.log("getMe result:", data);

        setUser(data.user);
    } catch (error) {
        console.log("Auth error:", error);
        setUser(null);
    } finally {
        setLoading(false);
    }
};

        getAndSetUser();

    }, []);


    return { user, loading, handleRegister, handleLogin, handleLogout };
};
