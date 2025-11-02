import axios from "../axiosInstance";

/**
 * Fetch a single artist by ID
 * @param {string} artistId - The artist ID
 * @returns {Promise<Object>} Artist details
 */
export async function getArtistById(artistId) {
  const response = await axios.get(`/Artists/${artistId}`);
  return response.data;
}
