import axios from "axios";

export default function config() {
 axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
}