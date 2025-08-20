import api from "./Api";

export const addPurchase = (data) => api.post('/purchase', data)
export const getPurchases = (data) => api.post('/purchase/all', data)


