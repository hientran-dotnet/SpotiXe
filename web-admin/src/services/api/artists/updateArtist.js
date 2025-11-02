import axios from "../axiosInstance";

/**
 * Update an existing artist
 * @param {string} artistId - The artist ID
 * @param {Object} artistData - Updated artist data
 * @returns {Promise<Object>} Updated artist
 */
export async function updateArtist(artistId, artistData) {
  const response = await axios.put(`/Artists/${artistId}`, artistData);
  return response.data;
}
