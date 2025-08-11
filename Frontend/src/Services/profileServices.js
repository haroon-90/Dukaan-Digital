import api from "./api";

export const getProfile = ()=> api.get('/profile')
export const updateProfile = (data, id)=> api.put(`/profile/update/${id}`, data)
export const deleteProfile = (id)=> api.delete(`/profile/update/${id}`)