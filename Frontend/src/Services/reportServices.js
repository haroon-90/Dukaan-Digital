import api from "./Api";

export const getReport = (data) => api.post('/report', data)