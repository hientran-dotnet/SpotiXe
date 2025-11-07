import axios from "axios";
import { API_CONFIG, ENDPOINTS } from "../../config/api";

/**
 * Axios instance for Song API
 * Base URL from config
 */
const songApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.TIMEOUT,
});

/**
 * Request interceptor - Add auth token if available
 */
songApi.interceptors.request.use(
  (config) => {
    // Get token from Firebase auth if needed
    // const token = auth.currentUser?.accessToken;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
songApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);

/**
 * Get all songs
 * @returns {Promise<Array>} Array of song objects
 */
export const getAllSongs = async () => {
  const response = await songApi.get(ENDPOINTS.SONGS);
  return response;
};

/**
 * Get song by ID
 * @param {number} id - Song ID
 * @returns {Promise<Object>} Song object
 */
export const getSongById = async (id) => {
  const response = await songApi.get(ENDPOINTS.SONG_BY_ID(id));
  return response;
};

/**
 * Create new song
 * @param {Object} songData - Song data
 * @returns {Promise<Object>} Created song object
 */
export const createSong = async (songData) => {
  const response = await songApi.post(ENDPOINTS.SONGS, songData);
  return response;
};

/**
 * Update song
 * @param {number} id - Song ID
 * @param {Object} songData - Updated song data
 * @returns {Promise<Object>} Updated song object
 */
export const updateSong = async (id, songData) => {
  const response = await songApi.put(ENDPOINTS.SONG_BY_ID(id), songData);
  return response;
};

/**
 * Delete song
 * @param {number} id - Song ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSong = async (id) => {
  const response = await songApi.delete(ENDPOINTS.SONG_BY_ID(id));
  return response;
};

/**
 * Upload song cover image
 * @param {number} id - Song ID
 * @param {File} file - Image file
 * @returns {Promise<Object>} Upload response with URL
 */
export const uploadCoverImage = async (id, file) => {
  const formData = new FormData();
  formData.append("cover", file);

  const response = await songApi.post(ENDPOINTS.SONG_COVER(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * Upload song audio file
 * @param {number} id - Song ID
 * @param {File} file - Audio file
 * @returns {Promise<Object>} Upload response with URL
 */
export const uploadAudioFile = async (id, file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await songApi.post(ENDPOINTS.SONG_AUDIO(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload Progress: ${percentCompleted}%`);
    },
  });
  return response;
};

export default songApi;
