import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard">
            <h1>Welcome, {user.name}</h1>
            <p>Your role: {user.role}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}