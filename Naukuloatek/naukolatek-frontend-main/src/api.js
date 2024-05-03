const API_HOST = "http://127.0.0.1:3001";

const isCacheValid = (cacheTimestamp) => {
    const now = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;
    return now - cacheTimestamp < tenMinutes;
};

const addGrade = async (grade, teacherName) => {
    try {
        const response = await fetch(`${API_HOST}/grade/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "grade": parseInt(grade), teacherName }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to add grade:", error);
        throw error;
    }
};


const getTimeTable = async () => {
    try {
        const cacheKey = "timetableCache";
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestampKey = "timetableCacheTimestamp";
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

        if (cachedData && cachedTimestamp && isCacheValid(parseInt(cachedTimestamp, 10))) {
            return JSON.parse(cachedData);
        }

        const response = await fetch(`${API_HOST}/lesson/timetable`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, new Date().getTime().toString());

        return data;
    } catch (error) {
        console.error("Failed to fetch timetable:", error);
        throw error;
    }
};

export { getTimeTable, addGrade };