import api from "./api";

export const getProducts = () => api.get("/product");
export const addProduct = (data) => api.post("/product", data);
export const UpdateProducts = (data, id) => api.put(`/product/${id}`, data);
export const deleteProducts = (data, id) => api.delete(`/product/${id}`, data);