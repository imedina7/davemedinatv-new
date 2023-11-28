import axios from 'axios';

export const createClient = (baseURL: string, headers?: Record<string,any>) => axios.create({ baseURL, headers });

