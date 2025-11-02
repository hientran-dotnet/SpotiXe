import axios from "../axiosInstance";

/**
 * Fetch all artists from the API with server-side pagination
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 20)
 * @returns {Promise<Object>} Paged result with items, totalCount, etc.
 */
export async function getAllArtists(params = {}) {
  const { pageNumber = 1, pageSize = 20 } = params;

  const res = await axios.get("/Artists", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  // Return full response object from backend
  return res.data;
}
