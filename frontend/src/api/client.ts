import axios from "axios";

export const BASE_URL = "http://192.168.1.5:3000"; // YOUR IP
// export const BASE_URL = "http://192.168.1.6"; // YOUR IP

export const api = axios.create({
    baseURL: BASE_URL,
});
