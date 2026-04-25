import axios from "axios";


export const http = axios.create({

    baseURL: "http://localhost:8091/api",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: false,
});
