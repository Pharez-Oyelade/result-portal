// export const getResults = () => {
//     const storedResults = localStorage.getItem('results');
//     return storedResults ? JSON.parse(storedResults) : [];
// };

// export const saveResults = (results) => {
//     localStorage.setItem('results', JSON.stringify(results));
// };

export const initialResults = [
    {
        regNo: "stu001",
        department: "Computer Science",
        results: [
            {courseId: "csc101", score: 85},
            {courseId: "csc102", score: 90},
        ],
        status: "pending"
    },
    {
        regNo: "stu002",
        department: "Computer Science",
        results: [
            {courseId: "csc101", score: 78},
            {courseId: "csc103", score: 88},
        ],
        status: "pending"
    },
    {
        regNo: "stu003",
        department: "Computer Science",
        results: [
            {courseId: "csc102", score: 92},
            {courseId: "csc104", score: 80},
        ],
        status: "pending"
    },
    {
        regNo: "stu004",
        department: "Computer Science",
        results: [
            {courseId: "csc101", score: 75},
            {courseId: "csc105", score: 85},
        ],
        status: "pending"
    },
    {
        regNo: "stu005",
        department: "Computer Science",
        results: [
            {courseId: "csc106", score: 95},
            {courseId: "csc102", score: 90},
        ],
        status: "pending"
    },
    {
        regNo: "stu006",
        department: "Computer Science",
        results: [
            {courseId: "csc103", score: 88},
            {courseId: "csc104", score: 82},
        ],
        status: "pending"
    }
]