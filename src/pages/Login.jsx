import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = login(email, password);
        if (user) {
           if (user.role === "hod") navigate("/hod");
           else if (user.role === "admin") navigate("/admin");
           else if (user.role === "lecturer") navigate("/lecturer");
           else navigate("/dashboard");
        } else {
            setError("Invalid email or password");
        }

    }

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input 
            className="border p-2 w-full mb-3" placeholder="Email" 
            value={email} 
            onChange={(e)=> setEmail(e.target.value)} />

            <input 
            className="border p-2 w-full mb-3" placeholder="Password" 
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)} />

            <button
            className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
        </form>
    </div>
)
}