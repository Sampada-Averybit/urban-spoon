const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$|\s+$/g, "");

export function apiUrl(path) {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}
