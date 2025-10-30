import axios from "../axiosInstance";

export async function createSong(songData) {
  const res = await axios.post("/songs", songData);
  return res.data;
}
