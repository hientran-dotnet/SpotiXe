import axios from "../axiosInstance";

export async function getAllSongs() {
  const res = await axios.get("/Songs");
  // Response format: { items: [...], page, pageSize, totalCount, ... }
  // Trả về items array
  return res.data?.items ?? [];
}
