import { useState } from 'react';

const useLazyQuery = (apiFunction) => {
    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const callApi = async (args) => {
        setIsLoading(true);
        let response = undefined
        try {
            const { data: result } = await apiFunction(args);
            response = result
            setData(response);
        } catch (error) {
            response = error
            setIsError(true)
            setErrorMessage(error)
        }
        setIsLoading(false);
        return response;
    };

    return {
        apiCbFunction: callApi,
        data,
        isLoading,
        isError,
        errorMessage
    };
};

export default useLazyQuery;