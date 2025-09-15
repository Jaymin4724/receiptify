import axios from "axios";

// This line dynamically sets the base URL.
// When you run `npm run dev`, it reads from `.env.development` and the URL becomes "".
// This allows the Vite proxy to handle requests to relative paths like "/api/...".
//
// When you run `npm run build`, it reads from `.env.production` and sets the full
// URL of your live backend.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";

// This is crucial for authentication. It tells Axios to send cookies
// (like your JWT session token) with every request.
axios.defaults.withCredentials = true;

export default axios;
