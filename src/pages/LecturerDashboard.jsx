import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';

const LecturerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]); // State to store courses assigned to the logged-in user

    useEffect(() => {
      // Fetch courses from local storage
      const assignments = JSON.parse(localStorage.getItem("courseAssignments")) || [];

      // Filter courses assigned to the logged-in user
      const assignedCourseIds = assignments
        .filter(a => a.lecturerEmail === user.email)
        .map(a => a.courseId);

      const assignedCourses = courses.filter(course => assignedCourseIds.includes(course.id));
      setMyCourses(assignedCourses);
    }, [user.email])


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