// src/services/api/medicinesApi.ts
import { api } from "./axios";

export const medicinesApi = {
  async getAll(): Promise<Medicine[]> {
    const res = await api.get<Medicine[] | { medicines: Medicine[] }>("/medicines");
    return Array.isArray(res.data) ? res.data : res.data.medicines;
  },

  async create(m: Medicine): Promise<Medicine> {
    const res = await api.post<Medicine>("/medicines", m);
    return res.data;
  },

  async update(m: Medicine): Promise<Medicine> {
    const res = await api.put<Medicine>(`/medicines/${m.id}`, m);
    return res.data;
  },

  async remove(id: string): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/medicines/${id}`);
    return res.data;
  },
};
