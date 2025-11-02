import axios from "../axiosInstance";

/**
 * Delete (soft delete) an artist
 * @param {string} artistId - The artist ID to delete
 * @returns {Promise<Object>} Deletion response
 */
export async function deleteArtist(artistId) {
  const response = await axios.delete(`/Artists/${artistId}`);
  return response.data;
}
