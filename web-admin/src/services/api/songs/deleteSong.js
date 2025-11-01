import axios from "../axiosInstance";

/**
 * Delete a song
 * @param {number|string} songId - The ID of the song to delete
 * @returns {Promise} - The response data
 */
export async function deleteSong(songId) {
  const response = await axios.delete(`/Songs/${songId}`);
  return response.data;
}
