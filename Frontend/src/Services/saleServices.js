import api from "./api";

export const getsales = () => api.get('/sales')
export const createsale = (data) => api.post('/sales', data)
export const deletesale = (id) => api.delete(`/sales${id}`);