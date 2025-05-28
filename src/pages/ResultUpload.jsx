import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { students } from "../data/students";
import { courses } from "../data/courses";
// import { getResults, saveResults } from '../data/results'
import { getResults, addOrUpdateResult } from "../utils/storage";

// Main component for uploading results
const ResultUpload = () => {
  // Get current user from AuthContext
  const { user } = useAuth();
  // Get courseId from URL parameters
  const { courseId } = useParams();
  // For navigation between pages
  const navigate = useNavigate();
  // Find the course object based on courseId
  const course = courses.find((course) => course.id === courseId);
  // State to hold the list of students and their scores
  const [results, setResults] = useState([]);
  // State to track if results have been submitted
  const [submitted, setSubmitted] = useState(false);

  // Load existing results and initialize the results state when courseId changes
  useEffect(() => {
    // Fetch all existing results from storage
    const exixtingResults = getResults();

    // Only include students from the same department as the user
    const filteredStudents = students.filter(
      (student) => student.department === user.department
    );

    // Map students to include their score for the current course (if any)
    const updated = filteredStudents.map((student) => {
      // Find the student's result record
      const studentResult = exixtingResults.find(
        (r) => r.regNo === student.regNo
      );
      // Find the score for this course, if it exists
      const courseEntry = studentResult
        ? studentResult.results.find((r) => r.courseId === courseId)
        : null;
      return {
        ...student,
        score: courseEntry ? courseEntry.score : "",
      };
    });

    setResults(updated);
  }, [courseId, user.department]);

  // Handle changes in the score input fields
  const handleChange = (regNo, score) => {
    // Update the score for the specific student
    const updated = results.map((r) =>
      r.regNo === regNo ? { ...r, score } : r
    );
    setResults(updated);
  };

  // Handle form submission to save results
  const handleSubmit = (e) => {
    e.preventDefault();
    // For each student, create a result record and save/update it in storage
    results.forEach((student) => {
      const newRecord = {
        regNo: student.regNo,
        department: user.department,
        results: [
          {
            courseId,
            score: Number(student.score),
          },
        ],
        status: "pending",
      };

      addOrUpdateResult(newRecord);
    });
    setSubmitted(true);
  };

  return (
    <div className="p-6">
      {/* Button to navigate back to the lecturer dashboard */}
      <button
        onClick={() => navigate("/lecturer")}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        ← Back to Lecturer Dashboard
      </button>
      {/* Display the course name */}
      <h1 className="text-2xl font-bold mb-4">
        Upload Results for: {course.name}
      </h1>

      {/* Form for entering and submitting student scores */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {results.map((student) => (
          <div key={student.regNo} className="flex items-center space-x-4">
            {/* Display student name */}
            <p className="w-48">{student.name}</p>
            {/* Input for entering the student's score */}
            <input
              type="number"
              value={student.score}
              onChange={(e) => handleChange(student.regNo, e.target.value)}
              className="border p-2 w-24"
              placeholder="Enter score"
              required
            />
          </div>
        ))}

        {/* Submit button for the form */}
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Results
        </button>
      </form>

      {/* Show success message after submission */}
      {submitted && (
        <p className="mt-4 text-green-600">Results submitted successfully</p>
      )}
    </div>
  );
};

export default ResultUpload;
