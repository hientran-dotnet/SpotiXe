import axios from "../axiosInstance";

/**
 * Update an existing song
 * @param {number|string} songId - The ID of the song to update
 * @param {Object} songData - The updated song data
 * @returns {Promise} - The updated song data
 */
export async function updateSong(songId, songData) {
  const response = await axios.put(`/Songs/${songId}`, songData);
  return response.data;
}
