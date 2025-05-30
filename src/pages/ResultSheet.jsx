import React, { useEffect, useState } from "react";
import { students } from "../data/students";
import { courses } from "../data/courses";
import { getResults } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logoipsum-365.svg";
import { getGrade } from "../utils/gradeUtils";

const ResultSheet = () => {
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [cgpaApproved, setCgpaApproved] = useState(false);
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

  const course = courses.find((c) => c.id === studentResult?.courseId);

  // Function to approve CGPA (admin only)
  const handleApproveCgpa = () => {
    if (!student) return;
    // Update the student's CGPA in localStorage (or students.js if persistent)
    const studentsData =
      JSON.parse(localStorage.getItem("students")) || students;
    const idx = studentsData.findIndex((s) => s.regNo === student.regNo);
    if (idx !== -1) {
      studentsData[idx].cgpa = newCgpa;
      localStorage.setItem("students", JSON.stringify(studentsData));
      setCgpaApproved(true);
    }
  };

  // Approve all results and CGPAs for all students (admin only)
  const handleApproveAll = () => {
    // Approve all pending results
    const updatedResults = results.map((result) =>
      result.status !== "approved" ? { ...result, status: "approved" } : result
    );
    setResults(updatedResults);
    localStorage.setItem("student_results", JSON.stringify(updatedResults));

    // Approve and update CGPA for all students
    const studentsData =
      JSON.parse(localStorage.getItem("students")) || students;
    filteredStudents.forEach((student) => {
      const studentResult = updatedResults.find(
        (r) => r.regNo === student.regNo
      );
      if (studentResult && studentResult.status === "approved") {
        // Calculate new CGPA for this student
        const validResults = studentResult.results.filter((r) => {
          const course = courses.find((c) => c.id === r.courseId);
          if (!course) return false;
          const { grade } = getGrade(r.score);
          return grade !== "AR";
        });
        let totalUnits = 0;
        let totalPoints = 0;
        validResults.forEach((r) => {
          const course = courses.find((c) => c.id === r.courseId);
          if (course && course.point) {
            const { points } = getGrade(r.score);
            totalUnits += course.point;
            totalPoints += points * course.point;
          }
        });
        const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
        const idx = studentsData.findIndex((s) => s.regNo === student.regNo);
        const previousCgpa =
          studentsData[idx] && studentsData[idx].cgpa
            ? Number(studentsData[idx].cgpa)
            : 0;
        const newCgpa = previousCgpa > 0 ? (previousCgpa + gpa) / 2 : gpa;
        if (idx !== -1) {
          studentsData[idx].cgpa = newCgpa;
        }
      }
    });
    localStorage.setItem("students", JSON.stringify(studentsData));
    setCgpaApproved(true);
  };

  return (
    <div className="p-6 max-w-2xl  mx-auto ">
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

          <h2 className="text-lg font-bold">{student.regNo}</h2>
          <h2 className="text-lg font-semibold mb-2">{student.name}</h2>
          {studentResult && studentResult.results.length > 0 ? (
            <div>
              {/* Main Results Table */}
              <table className="w-full border mt-2">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Course Code</th>
                    <th className="border px-2 py-1">COURSE TITLE</th>
                    <th className="border px-2 py-1">UNIT</th>
                    <th className="border px-2 py-1">SCORE</th>
                    <th className="border px-2 py-1">GRADE</th>
                    <th className="border px-2 py-1">POINTS</th>
                    <th className="border px-2 py-1">REMARK</th>
                  </tr>
                </thead>
                <tbody>
                  {/* For admin, show all courses for the student's department, including ARs */}
                  {(user.role === "admin"
                    ? courses.filter((c) => c.department === student.department)
                    : studentResult.results
                        .map((r) => courses.find((c) => c.id === r.courseId))
                        .filter(Boolean)
                  ).map((course, idx) => {
                    const result = studentResult.results.find(
                      (r) => r.courseId === course.id
                    );
                    let score = result ? result.score : null;
                    let { grade, points, remark } = result
                      ? getGrade(result.score)
                      : { grade: "AR", points: 0, remark: "Awaiting Result" };
                    // If AR, show as AR and do not count towards CGPA
                    return (
                      <tr key={course.id}>
                        <td className="border px-2 py-1">
                          {course.id.toUpperCase()}
                        </td>
                        <td className="border px-2 py-1">{course.name}</td>
                        <td className="border px-2 py-1">{course.point}</td>
                        <td className="border px-2 py-1">
                          {score !== null && score !== undefined ? score : "AR"}
                        </td>
                        <td className="border px-2 py-1">{grade}</td>
                        <td className="border px-2 py-1">
                          {grade === "AR" ? "-" : points * course.point}
                        </td>
                        <td className="border px-2 py-1">{remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Outstanding Results Table (ARs and failed courses) */}
              {(() => {
                // Find ARs and failed courses (grade F or AR)
                const allCourses = courses.filter(
                  (c) => c.department === student.department
                );
                const arAndFailed = allCourses.filter((course) => {
                  const result = studentResult.results.find(
                    (r) => r.courseId === course.id
                  );
                  if (!result) return true; // AR
                  const { grade } = getGrade(result.score);
                  return grade === "F";
                });
                // Persist outstanding courses in localStorage for the student
                if (arAndFailed.length > 0) {
                  let outstandingData = JSON.parse(
                    localStorage.getItem("outstandingResults") || "{}"
                  );
                  outstandingData[student.regNo] = Array.from(
                    new Set([
                      ...(outstandingData[student.regNo] || []),
                      ...arAndFailed.map((c) => c.id),
                    ])
                  );
                  localStorage.setItem(
                    "outstandingResults",
                    JSON.stringify(outstandingData)
                  );
                }
                if (arAndFailed.length > 0) {
                  return (
                    <>
                      <div className="flex items-center justify-center mt-6">
                        <span className="p-3 font-bold">
                          Outstanding Results
                        </span>
                      </div>
                      <table className="w-full border mt-2">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Course Code</th>
                            <th className="border px-2 py-1">COURSE TITLE</th>
                            <th className="border px-2 py-1">UNIT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arAndFailed.map((course) => (
                            <tr key={course.id}>
                              <td className="border px-2 py-1">
                                {course.id.toUpperCase()}
                              </td>
                              <td className="border px-2 py-1">
                                {course.name}
                              </td>
                              <td className="border px-2 py-1">
                                {course.point}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                }
                return null;
              })()}

              {/* Calculate semester, total units, total points, GPA, and class */}
              {(() => {
                // Only count results that are not AR for CGPA
                const validResults = studentResult.results.filter((r) => {
                  const course = courses.find((c) => c.id === r.courseId);
                  if (!course) return false;
                  const { grade } = getGrade(r.score);
                  return grade !== "AR";
                });
                const resultCourses = validResults
                  .map((r) => courses.find((c) => c.id === r.courseId))
                  .filter(Boolean);
                const semesters = Array.from(
                  new Set(resultCourses.map((c) => c.semester))
                );
                const semester = semesters.length > 0 ? semesters[0] : "";
                let totalUnits = 0;
                let totalPoints = 0;
                validResults.forEach((r) => {
                  const course = courses.find((c) => c.id === r.courseId);
                  if (course && course.point) {
                    const { points } = getGrade(r.score);
                    totalUnits += course.point;
                    totalPoints += points * course.point;
                  }
                });
                const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
                let gpaClass = "";
                if (gpa >= 4.5) gpaClass = "First Class";
                else if (gpa >= 3.5) gpaClass = "Second Class Upper";
                else if (gpa >= 2.4) gpaClass = "Second Class Lower";
                else if (gpa >= 1.5) gpaClass = "Third Class";
                else if (gpa > 0) gpaClass = "Pass";
                else gpaClass = "-";
                // CGPA logic
                const previousCgpa =
                  student && student.cgpa ? Number(student.cgpa) : 0;
                const newCgpa =
                  previousCgpa > 0 ? (previousCgpa + gpa) / 2 : gpa;
                return (
                  <>
                    <div className="flex items-center justify-center">
                      <span className="p-3 font-bold">
                        Semester Performance (
                        {semester
                          ? semester.charAt(0).toUpperCase() +
                            semester.slice(1) +
                            " Semester"
                          : "Semester"}
                        )
                      </span>
                    </div>
                    <table className="w-full border mt-2">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">POINTS </th>
                          <th className="border px-2 py-1">UNITS</th>
                          <th className="border px-2 py-1">GPA</th>
                          <th className="border px-2 py-1">CLASS</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">{totalPoints}</td>
                          <td className="border px-2 py-1">{totalUnits}</td>
                          <td className="border px-2 py-1">{gpa.toFixed(2)}</td>
                          <td className="border px-2 py-1">{gpaClass}</td>
                        </tr>
                      </tbody>
                    </table>
                    {/* CGPA Table */}
                    <div className="flex items-center justify-center mt-4">
                      <span className="p-3 font-bold">
                        Cumulative Grade Point Average (CGPA)
                      </span>
                    </div>
                    <table className="w-full border mt-2">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Previous CGPA</th>
                          <th className="border px-2 py-1">Current GPA</th>
                          <th className="border px-2 py-1">New CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">
                            {previousCgpa.toFixed(2)}
                          </td>
                          <td className="border px-2 py-1">{gpa.toFixed(2)}</td>
                          <td className="border px-2 py-1">
                            {newCgpa.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* Admin approval button for CGPA */}
                    {user && user.role === "admin" && !cgpaApproved && (
                      <div className="flex items-center justify-center mt-2">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded"
                          onClick={handleApproveCgpa}
                        >
                          Approve CGPA
                        </button>
                      </div>
                    )}
                    {cgpaApproved && (
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-green-600 font-bold">
                          CGPA Approved and Updated!
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-gray-500">
              No approved results found for this student.
            </p>
          )}
        </div>
      )}

      {user && user.role === "admin" && (
        <div className="flex items-center justify-center mt-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleApproveAll}
          >
            Approve All Results & CGPA
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultSheet;
