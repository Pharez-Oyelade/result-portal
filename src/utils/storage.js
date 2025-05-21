const KEY = "student_results";

export const getResults = () => {
    const storedResults = localStorage.getItem(KEY);
    return storedResults ? JSON.parse(storedResults) : [];
};

export const saveResults = (results) => {
    localStorage.setItem(KEY, JSON.stringify(results));
}

export const addOrUpdateResult = (newResult) => {
    const results = getResults();
    const index = results.findIndex(result => result.regNo === newResult.regNo);

    if (index > -1) {
        // Merge new course result into existing results for this student
        const existing = results[index];
        // Remove any existing entry for the same courseId
        const filteredCourses = existing.results.filter(r => r.courseId !== newResult.results[0].courseId);
        // Add the new course result
        const mergedResults = [...filteredCourses, ...newResult.results];
        // Keep the latest status (reset to pending on new upload)
        results[index] = {
            ...existing,
            results: mergedResults,
            status: 'pending'
        };
    } else {
        // Add new result
        results.push(newResult);
    }

    saveResults(results);
}