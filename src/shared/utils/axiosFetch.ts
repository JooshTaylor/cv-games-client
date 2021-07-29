import axios, { AxiosRequestConfig } from 'axios';

export interface FetchOptions<TResponse = any, TBody = any> {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: TBody;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: any) => void;
}

export const axiosFetch = <TResponse = any, TBody = any>(options: FetchOptions<TResponse, TBody>) => {
  const { url, method = 'get', body, onSuccess, onError } = options;

  const source = axios.CancelToken.source();

  const requestOptions: AxiosRequestConfig = {
    method,
    url,
    cancelToken: source.token
  };

  if (body) {
    requestOptions.data = body;
  }

  axios(requestOptions)
    .then(res => {
      onSuccess && onSuccess(res.data);
    })
    .catch(err => {
      onError && onError(err);
    });
};