import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';

const LecturerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    //filter courses assigned to the logged-in user
    const myCourses = courses.filter(course => course.assignedTo === user.email);

  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>Lecturer Dashboard</h1>
        <p>Welcome, {user.name}</p>

        <h2 className='text-xl font-semibold mb-2'>My Courses</h2>

        <div className='sapce-y-4'>
          {myCourses.map(course => (
            <div key={course.id} className='p-4 border bg-white rounded shadow'>
              <h3 className='font-medium'>{course.name}</h3>
              <button onClick={() => navigate(`/upload/${course.id}`)} className='mt-2 bg-blue-500 text-white px-4 py-1 rounded'>
                Upload Results
              </button>
            </div>
          ))}
          {myCourses.length === 0 && <p>You don't have any assigned courses yet</p>}
        </div>

        <button onClick={logout} className='mt-4 bg-red-500 text-white px-4 py-2 rounded'>Logout</button>
    </div>
  )
}

export default LecturerDashboard