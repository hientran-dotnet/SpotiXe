import axios from "../axiosInstance";

export async function getAllArtists() {
  const res = await axios.get("/artists");
  return res.data?.items ?? [];
}
