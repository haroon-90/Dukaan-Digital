import api from "./api";

export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const addProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProducts = ( id) => api.delete(`/products/${id}`);