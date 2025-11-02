import axios from "../axiosInstance";

export async function getAllAlbums() {
  const res = await axios.get("/albums");
  return res.data?.items ?? [];
}
