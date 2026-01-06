import { useCallback, useEffect, useState } from 'react';
import data from '../assets/data.json'; // Importing JSON directly

export const useDataSimulator = () => {
    // Initial state from JSON
    const [totalData, setTotalData] = useState(data.totalDataMB);
    const [usedData, setUsedData] = useState(data.initialUsedMB);
    const [userName, setUserName] = useState(data.userName);
    const [planName, setPlanName] = useState(data.planName);

    useEffect(() => {
        // Here we could fetch from an API, but for now we rely on the imported JSON.
        // We can simulate an API delay if needed, but it's not requested.

        // Start simulation loop
        const interval = setInterval(() => {
            setUsedData((prev) => {
                if (prev >= totalData) {
                    clearInterval(interval);
                    return totalData;
                }
                // Simulate random data usage
                const increment = Math.random() * 15 + 5;
                return Math.min(prev + increment, totalData);
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [totalData]);

    const recharge = useCallback(() => {
        setUsedData(0);
    }, []);

    const percentage = usedData / totalData;

    return {
        totalData,
        usedData,
        percentage,
        recharge,
        userName,
        planName
    };
};
