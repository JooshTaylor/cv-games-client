import React from 'react';
import { axiosFetch, FetchOptions } from '../utils/axiosFetch';

export const useFetch = <TResponse = any, TBody = any>(fetchOptions: FetchOptions<TResponse, TBody>) => {
  React.useEffect(() => {
    if (!fetchOptions)
      return;

    const options: FetchOptions = {
      ...fetchOptions,
      onSuccess: (data: TResponse) => {
        fetchOptions.onSuccess && fetchOptions.onSuccess(data);
      },
      onError: (error: any) => {
        fetchOptions.onError && fetchOptions.onError(error);
      }
    }

    axiosFetch(options);
  }, [ fetchOptions?.url, fetchOptions?.method ]);
};