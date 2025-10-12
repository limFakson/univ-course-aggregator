import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
});

export const getCourses = (params = {}) => api.get("/courses", { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getUniversities = () => api.get("/universities");
export const getDepartments = () => api.get("/departments");

// 🆕 Create Course API
export const createCourse = (data) => api.post("/courses", data);

export default api;