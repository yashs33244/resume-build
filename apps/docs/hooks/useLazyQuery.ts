import { useState } from 'react';

const useLazyQuery = (apiFunction:any) => {
    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const callApi = async (args:any) => {
        setIsLoading(true);
        let response = undefined
        try {
            const result  = await apiFunction(args);
            response = result
            setData(response);
        } catch (error:any) {
            response = error
            setIsError(true)
            setErrorMessage(error)
        }
        setIsLoading(false);
        console.log(response)
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