import { useEffect, useState } from 'react';

const useQuery = (apiFunction, args) => {
    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await apiFunction(args);
                setData(response);
            } catch (error) {
                setIsError(true)
                setErrorMessage(error)
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return {
        data,
        isLoading,
        isError,
        errorMessage
    };
};

export default useQuery;