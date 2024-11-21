import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Generic API service to make HTTP requests.
 * @param url - The endpoint to hit.
 * @param options - Axios configuration options.
 * @returns A promise resolving to the response data.
 */
export const apiRequest = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await axios(url, options);
  return response.data;
};
