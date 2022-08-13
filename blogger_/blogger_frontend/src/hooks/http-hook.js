import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //   it turns it into reference ,which willnot be reinitialised
  // this function will reerun again whenever the component which use this hook rerender,store data across rerender cycles
  const activeHttpRequests = useRef([]);

  //header mustn't be null but a empty object
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        // abortController modern browser,we can assign an abortController to a request.
        const httpAbortCtrl = new AbortController();
        // current stores the current useRef active Http Requests
        // I am not using state for this purpose because I don't wan't to change the UI if the data changes ,this is just the behind scene data.
        activeHttpRequests.current.push(httpAbortCtrl);
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        activeHttpRequests.current =activeHttpRequests.current.filter(reqCtrl=>reqCtrl!==httpAbortCtrl);

        // 400 ish or 500 ish status code
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => setError(null);

  //   but also can be used to do cleanup logic whenever the component unmounts
  useEffect(() => {
      return ()=>{
          activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort());
      }
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
