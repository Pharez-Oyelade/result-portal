import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Logo from "./assets/logoipsum-365.svg";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HodDashboard from "./pages/HodDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import ResultUpload from "./pages/ResultUpload";
import ResultSheet from "./pages/ResultSheet";


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

// NavBar should not be exported, only used inside App
function NavBar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex gap-4 items-center">
      <img src={Logo} alt="" />
      <Link to="/dashboard">Home</Link>
      {user.role === "admin" && <Link to="/admin">Admin</Link>}
      {user.role === "hod" && <Link to="/hod">HOD</Link>}
      {user.role === "lecturer" && <Link to="/lecturer">Lecturer</Link>}
      <Link to="/results">Result Sheet</Link>
      <button onClick={logout} className="ml-auto bg-red-500 px-3 py-1 rounded">Logout</button>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/hod"
            element={
              <PrivateRoute>
                <HodDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/lecturer"
            element={
              <PrivateRoute>
                <LecturerDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/upload/:courseId"
            element={
              <PrivateRoute>
                <ResultUpload />
              </PrivateRoute>
            }
          />
          <Route 
            path="/results"
            element={
              <PrivateRoute>
                <ResultSheet />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
