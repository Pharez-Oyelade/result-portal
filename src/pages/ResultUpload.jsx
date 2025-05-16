import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { students } from '../data/students'
import { courses } from '../data/courses'
// import { getResults, saveResults } from '../data/results'
import { getResults, addOrUpdateResult } from '../utils/storage'

const ResultUpload = () => {
    const { user } = useAuth();
    const { courseId } = useParams();
    const course = courses.find(course => course.id === courseId);
    const [results, setResults] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const exixtingResults = getResults();

        const updated = students.map(student => {
            const studentResult = exixtingResults.find(r => r.regNo === student.regNo);
            const courseEntry = studentResult ? studentResult.results.find(r => r.courseId === courseId) : null;
            return {
                ...student,
                score: courseEntry ? courseEntry.score : ''
            }
        });

        setResults(updated);
    }, [courseId]);

    const handleChange = (regNo, score) => {
        const updated = results.map(r => r.regNo === regNo ? { ...r, score } : r);
        setResults(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // send results to the server
        // for now, just logging to the console
        // console.log("Results submitted", results);
        // const existing = getResults();
        // const updatedResults = [...existing, { courseId, entries: results }];
        // saveResults(updatedResults);
        // setSubmitted(true);

        results.forEach(student => {
            const newRecord = {
                regNo: student.regNo,
                department: user.department,
                results: [
                    {
                        courseId,
                        score: Number(student.score)
                    }
                ],
                status: "pending"
            }

            addOrUpdateResult(newRecord);
        });
        setSubmitted(true);
    };
    
  return (
    <div className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>Upload Results for: {course.name}</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
            {results.map((student) => (
                <div key={student.regNo} className='flex items-center space-x-4'>
                    <p className='w-48'>{student.name}</p>
                    <input
                        type="number"
                        value={student.score}
                        onChange={(e) => handleChange(student.regNo, e.target.value)}
                        className='border p-2 w-24'
                        placeholder='Enter score'
                        required
                    />
                </div>
            ))}

            <button
                type='submit'
                className='mt-4 bg-green-600 text-white px-6 py-2 rounded'
            >
                Submit Results
            </button>
        </form>

        {submitted && <p className='mt-4 text-green-600'>Results submitted successfully</p>}
    </div>
  )
}

export default ResultUpload