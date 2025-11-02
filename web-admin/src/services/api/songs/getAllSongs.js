import axios from "../axiosInstance";

export async function getAllSongs(pageNumber = 1, pageSize = 20) {
  const res = await axios.get("/Songs", {
    params: { pageNumber, pageSize },
  });
  // Response format: { items: [...], page, pageSize, totalCount, totalPages, hasNext, hasPrevious }
  // Trả về full PagedResult object để hỗ trợ server-side pagination
  return res.data;
}
