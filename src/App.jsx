import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HodDashboard from "./pages/HodDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import ResultUpload from "./pages/ResultUpload";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {

  return (
    <AuthProvider>
       <Router>
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
      </Routes>
    </Router>
    </AuthProvider>
   
  )
}

export default App
