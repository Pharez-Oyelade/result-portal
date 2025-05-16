import React from 'react'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
    const { user, logout } = useAuth();
  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
        <button onClick={logout} className='mt-4 bg-red-500 text-white px-4 py-2 rounded'>Logout</button>
    </div>
  )
}

export default AdminDashboard