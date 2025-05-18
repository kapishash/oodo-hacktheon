import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // or your backend URL
  withCredentials: true, // crucial for sending cookies!
});

export default instance;
