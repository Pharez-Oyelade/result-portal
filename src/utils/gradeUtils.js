export const getGrade = (score) => {
    if (score >= 70) return { grade: "A", points: 5, remark: "Distinction" };
    if (score >= 60) return { grade: "B", points: 4, remark: "Excellent" };
    if (score >= 50) return { grade: "C", points: 3, remark: "Good" };
    if (score >= 45) return { grade: "D", points: 2, remark: "Pass" };  
    if (score >= 40) return { grade: "E", points: 1, remark: "Pass" };
    return { grade: "F", points: 0, remark: "Fail" };
}