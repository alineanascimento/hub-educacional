import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const getMaterials = (skip = 0, limit = 20) =>
  api.get(`/materials/?skip=${skip}&limit=${limit}`);

export const getMaterialById = (id) =>
  api.get(`/materials/${id}`);

export const createMaterial = (data) =>
  api.post('/materials/', data);

export const updateMaterial = (id, data) =>
  api.patch(`/materials/${id}`, data);

export const deleteMaterial = (id) =>
  api.delete(`/materials/${id}`);

export const suggestWithAI = (title, resource_type) =>
  api.post('/ai/suggest', { title, resource_type });