import axios from "../axiosInstance";

export async function getSongById(id) {
  const res = await axios.get(`/songs/${id}`);
  // Response trả về trực tiếp object song (không có wrapper data)
  return res.data ?? null;
}
