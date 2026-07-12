export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  public readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export type SessionUser = {
  id: string;
  email: string;
  role: 'FLEET_MANAGER' | 'DISPATCHER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';
};

export function getStoredUser(): SessionUser | null {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) as SessionUser : null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem('token');

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' && body && 'error' in body
      ? String(body.error)
      : 'The request could not be completed.';
    throw new ApiError(message, response.status);
  }

  return body as T;
}

export async function downloadReport(path: string, filename: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(payload?.error ?? 'Unable to export the report.', response.status);
  }

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
