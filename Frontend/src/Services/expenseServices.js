import api from "./api";

export const addExpense = () => api.get('/expense');
export const getExpense = (data) => api.post('/expense', data);
export const deleteExpense = (id) => api.delete(`/expense/${id}`, );