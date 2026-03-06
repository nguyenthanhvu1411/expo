// config/api.js
export const API_HOST = "http://192.168.1.12:8000";
export const API_BASE = `${API_HOST}/api`;

export const storageUrl = (path) => {
  if (!path) return null;
  return `${API_HOST}/storage/${path}`;
};
