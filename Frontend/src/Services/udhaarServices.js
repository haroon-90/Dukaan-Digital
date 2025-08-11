import api from "./api";

export const addUdhaar = (data) => api.post("/udhaar", data);
export const getUdhaarlist = () => api.get("/udhaar");
export const updateUdhaar = (data, id) => api.put(`/udhaar/${id}`, data);
export const deleteUdhaar = (id) => api.get(`/udhaar/${id}`);