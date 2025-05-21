import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getResults, saveResults } from '../utils/storage'
import { students } from '../data/students'
import { courses } from '../data/courses'

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults(getResults());
    }, []);

    // Group results by student
    const studentResults = students.map(student => {
        // Find all result records for this student (may be multiple courses)
        const studentRecords = results.filter(r => r.regNo === student.regNo);
        // Flatten all course results for this student
        let allCourses = [];
        studentRecords.forEach(r => {
            r.results.forEach(courseResult => {
                allCourses.push({
                    ...courseResult,
                    status: r.status || 'pending',
                    regNo: r.regNo
                });
            });
        });
        return {
            ...student,
            courses: allCourses
        };
    });

    // Approve all pending results for a student
    const handleApproveStudent = (regNo) => {
        const updatedResults = results.map(result =>
            result.regNo === regNo ? { ...result, status: 'approved' } : result
        );
        setResults(updatedResults);
        saveResults(updatedResults);
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : courseId;
    };

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
            <p>Welcome, {user.name}</p>
            <h2 className='text-xl font-semibold mt-6 mb-2'>Students</h2>
            <div className='space-y-6'>
                {studentResults.map(student => (
                    <div key={student.regNo} className='border p-4 rounded bg-white shadow'>
                        <p className='font-bold mb-2'>{student.name} ({student.regNo})</p>
                        {student.courses.length === 0 ? (
                            <p className='text-gray-500'>No results uploaded yet.</p>
                        ) : (
                            <>
                                <ul className='ml-4 my-2'>
                                    {student.courses.map((course, idx) => (
                                        <li key={idx} className='flex items-center gap-2'>
                                            <span className='font-medium'>{getCourseName(course.courseId)}:</span> {course.score}
                                            <span className={course.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}>({course.status})</span>
                                        </li>
                                    ))}
                                </ul>
                                {student.courses.some(c => c.status !== 'approved') && (
                                    <button
                                        className='mt-2 bg-green-600 text-white px-4 py-1 rounded'
                                        onClick={() => handleApproveStudent(student.regNo)}
                                    >
                                        Approve All
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={logout} className='mt-8 bg-red-500 text-white px-4 py-2 rounded'>Logout</button>
        </div>
    )
}

export default AdminDashboard