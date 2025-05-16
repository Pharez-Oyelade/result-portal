import { createContext, useContext, useState } from "react";
import { users } from "../data/users";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (email, password) => {
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
            setUser(found)
            localStorage.setItem("loggedInUser", JSON.stringify(found));
        };
        return found;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("loggedInUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}