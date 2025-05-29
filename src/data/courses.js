export const courses = [
    {
        id: "csc101",
        name: "Introduction to Computer Science",
        point: 2,
        semester: "first",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc103",
        name: "Data Structures and Algorithms",
        point: 4,
        semester: "first",
        assignedTo: "carter@demo.edu",
        department: "Computer Science"
    },
    {
        id: "csc105",
        name: "Database Management Systems",
        point: 3,
        semester: "first",
        assignedTo: "carter@demo.edu",
        department: "Computer Science"
    },
    {
        id: "csc119",
        name: "Operating Systems",
        point: 3,
        semester: "first",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc115",
        name: "Software Engineering",
        point: 5,
        semester: "first",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc109",
        name: "Computer Networks",
        point: 3,
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "mat101",
        name: "Calculus I",
        assignedTo: null,
        department: "Mathematics"
    },
];

// load from local storage
export const getCourses = () => {
    const stored = localStorage.getItem("courses");
    return stored ? JSON.parse(stored) : courses;
};

export const saveCourses = (courses) => {
    localStorage.setItem("courses", JSON.stringify(courses));
};