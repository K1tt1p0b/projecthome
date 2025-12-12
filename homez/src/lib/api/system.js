import { apiClient } from "./client";

export async function pingApi() {
  const res = await apiClient.get("/health");
  return res.data;
}