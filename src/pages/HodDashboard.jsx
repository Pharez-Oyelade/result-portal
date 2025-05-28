import React, { useEffect, useState } from "react";
// import { getCourses, saveCourses } from '../data/courses';
// import { lecturers } from '../data/lecturers';
import { users } from "../data/users";
import { courses } from "../data/courses";
import { useAuth } from "../context/AuthContext";

const HodDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedLecturer, setSelectedLecturer] = useState({});
  const [assignments, setAssignments] = useState([]);
  // const [courses, setCourses] = useState(getCourses());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("courseAssignments")) || [];
    setAssignments(saved);
  }, []);

  // Only show lecturers from the same department as the HOD (if department property exists)
  const lecturers = users.filter(
    (u) =>
      u.role === "lecturer" &&
      u.department &&
      user.department &&
      u.department === user.department
  );
  // Only show courses from the same department as the HOD (if department property exists on course)
  const filteredCourses = courses.filter(
    (course) =>
      !course.department ||
      (user.department && course.department === user.department)
  );

  const handleAssign = (courseId) => {
    const lecturerEmail = selectedLecturer[courseId];
    if (!lecturerEmail) return alert("Please select a lecturer to assign");

    //prevent duplicate assignments
    const alreadyAssigned = assignments.find((a) => a.courseId === courseId);

    let updatedAssignments;
    if (alreadyAssigned) {
      updatedAssignments = assignments.map((a) =>
        a.courseId === courseId ? { ...a, lecturerEmail } : a
      );
    } else {
      updatedAssignments = [...assignments, { courseId, lecturerEmail }];
    }

    localStorage.setItem(
      "courseAssignments",
      JSON.stringify(updatedAssignments)
    );
    setAssignments(updatedAssignments);
  };

  const getAssignedLecturer = (courseId) => {
    const assignment = assignments.find((a) => a.courseId === courseId);
    if (!assignment) return "Not Assigned";
    const lecturer = lecturers.find(
      (l) => l.email === assignment.lecturerEmail
    );
    return lecturer ? lecturer.name : assignment.lecturerEmail;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome HOD, {user.name}</h1>

      <h2 className="text-xl font-semibold mb-2">Course Allocation</h2>

      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="border p-4 rounded-lg shadow bg-white"
          >
            <h3 className="font-semibold">{course.name}</h3>
            <p className="text-sm mb-2">
              Assigned to: <strong>{getAssignedLecturer(course.id)}</strong>
            </p>

            <select
              className="border rounded w-full p-2 mb-2"
              value={selectedLecturer[course.id] || ""}
              onChange={(e) =>
                setSelectedLecturer({
                  ...selectedLecturer,
                  [course.id]: e.target.value,
                })
              }
            >
              <option value="">-- Assign Lecturer --</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.email} value={lecturer.email}>
                  {lecturer.name}
                </option>
              ))}
            </select>

            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => handleAssign(course.id)}
            >
              Assign
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default HodDashboard;
