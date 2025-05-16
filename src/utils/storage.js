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
        // Update existing result
        results[index] = newResult;
    } else {
        // Add new result
        results.push(newResult);
    }

    saveResults(results);
}