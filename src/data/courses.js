export const courses = [
    {
        id: "csc101",
        name: "Introduction to Computer Science",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc102",
        name: "Data Structures and Algorithms",
        assignedTo: "carter@demo.edu",
        department: "Computer Science"
    },
    {
        id: "csc103",
        name: "Database Management Systems",
        assignedTo: "carter@demo.edu",
        department: "Computer Science"
    },
    {
        id: "csc104",
        name: "Operating Systems",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc105",
        name: "Software Engineering",
        assignedTo: null,
        department: "Computer Science"
    },
    {
        id: "csc106",
        name: "Computer Networks",
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