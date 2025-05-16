export const getResults = () => {
    const storedResults = localStorage.getItem('results');
    return storedResults ? JSON.parse(storedResults) : [];
};

export const saveResults = (results) => {
    localStorage.setItem('results', JSON.stringify(results));
};