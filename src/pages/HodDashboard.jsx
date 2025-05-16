import React, { useState } from 'react'
import { getCourses, saveCourses } from '../data/courses';
import { lecturers } from '../data/lecturers';
import { useAuth } from '../context/AuthContext'

const HodDashboard = () => {
    const { user, logout } = useAuth();
    const [courses, setCourses] = useState(getCourses());

    const handleAssign = (courseId, lecturerEmail) => {
      const updatedCourses = courses.map(course => course.id === courseId ? { ...course, assignedTo: lecturerEmail } : course);
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
    };

  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold'>Welcome HOD, {user.name}</h1>

        <h2 className='text-xl font-semibold mb-2'>Course Allocation</h2>

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border p-4 rounded-lg shadow bg-white">
              <h3 className='font-semibold'>{course.name}</h3>
              <p className='text-sm mb-2'>
                Assigned to: {" "}
                <span>
                  {course.assignedTo || "Not Assigned"}
                </span>
              </p>

              <select className='border p-2 mr-2' value={course.assignedTo || ""} onChange={(e) => handleAssign(course.id, e.target.value) }>
                <option value="">-- Assign Lecturer --</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.email} value={lecturer.email}>{lecturer.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        
        <button onClick={logout} className='mt-4 bg-red-500 text-white px-4 py-2 rounded'>Logout</button>
    </div>
  )
}

export default HodDashboard