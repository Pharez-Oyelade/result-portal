import React, { useEffect, useState } from "react";
import { students } from "../data/students";
import { courses } from "../data/courses";
import { getResults } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logoipsum-365.svg";

const ResultSheet = () => {
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setResults(getResults());
  }, []);

  const approvedResults = results.filter((r) => r.status === "approved");

  // Only show students from the same department as the user, unless admin
  const filteredStudents =
    user && user.role !== "admin"
      ? students.filter((s) => s.department === user.department)
      : students;

  const studentOptions = filteredStudents.map((s) => (
    <option key={s.regNo} value={s.regNo}>
      {s.name} ({s.regNo})
    </option>
  ));

  const student = filteredStudents.find((s) => s.regNo === selectedStudent);
  const studentResult = approvedResults.find(
    (r) => r.regNo === selectedStudent
  );

  return (
    <div className="p-6 max-w-xl mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Student Result Sheet</h1>
      <label className="block mb-2 font-medium">Select Student:</label>
      <select
        className="border p-2 rounded w-full mb-6"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">-- Select Student --</option>
        {studentOptions}
      </select>

      {selectedStudent && student && (
        <div className="bg-white p-4 rounded shadow relative">
          <div className="text-center mb-4">
            <h1 className="font-bold">VERIGRADE RESULT PORTAL</h1>
            <p className="text-sm text-gray-600">
              FACULTY OF {student.faculty.toUpperCase() || "Faculty"}
            </p>
            <p className="text-sm text-gray-600">
              DEPARTMENT OF {student.department.toUpperCase() || "Department"}
            </p>
            <p>
              {student.degree} ({student.department})
            </p>
          </div>

          <img src={Logo} alt="" className="absolute top-10" />

          <h2 className="text-lg font-semibold mb-2">
            {student.name} ({student.regNo})
          </h2>
          {studentResult && studentResult.results.length > 0 ? (
            <table className="w-full border mt-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Course</th>
                  <th className="border px-2 py-1">Score</th>
                </tr>
              </thead>
              <tbody>
                {studentResult.results.map((r, idx) => {
                  const course = courses.find((c) => c.id === r.courseId);
                  return (
                    <tr key={idx}>
                      <td className="border px-2 py-1">
                        {course ? course.name : r.courseId}
                      </td>
                      <td className="border px-2 py-1">{r.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">
              No approved results found for this student.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultSheet;
