import axios from "axios";
import { API_BASE } from "../config/api";
// php artisan serve --host=0.0.0.0 --port=8000
const httpAxios = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export default httpAxios;