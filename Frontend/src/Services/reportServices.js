import api from "./api";

export const getReport = (data) => api.get('/report', data)