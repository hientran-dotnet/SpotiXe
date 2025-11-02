import axios from "../axiosInstance";

export async function createArtist(artistData) {
  const res = await axios.post("/artists", artistData);
  return res.data;
}
