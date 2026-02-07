import { ApiResponse, DashboardResponse, Session, Achievement } from "@shared/types"

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || 'Request failed')
  return json.data
}

export async function getDashboardData(userId: string): Promise<DashboardResponse> {
  return api<DashboardResponse>(`/api/dashboard/${userId}`);
}

export async function completeSession(data: {
  userId: string;
  session: Session;
}): Promise<{
  success: boolean;
  newAchievements: Achievement[];
}> {
  return api('/api/session/complete', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}