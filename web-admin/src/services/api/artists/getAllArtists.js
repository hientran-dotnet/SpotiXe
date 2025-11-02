import axios from "../axiosInstance";

/**
 * Fetch all artists from the API
 * @returns {Promise<Array>} List of artists
 */
export async function getAllArtists() {
  const res = await axios.get("/Artists");
  return res.data?.items ?? res.data ?? [];
}
