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

/**
 * Bulk import songs from CSV data
 * This function will:
 * 1. Parse CSV data (AudioFileUrl, CoverImageUrl)
 * 2. Extract metadata from audio files
 * 3. Find or create artists by name from metadata
 * 4. Find albums by title from metadata (set null if not found)
 * 5. Insert songs with proper IDs
 *
 * @param {Array} csvData - Array of parsed CSV rows
 * @returns {Promise<Object>} Import results { successful: [], failed: [] }
 */
export const bulkImportSongs = async (csvData) => {
  const results = {
    successful: [],
    failed: [],
  };

  // Import required services and utilities
  const { getAllArtists, createArtist } = await import("./artistService");
  const { getAllAlbums } = await import("./albumService");
  const { extractAudioMetadata, formatReleaseDate } = await import(
    "../../utils/audioMetadata"
  );

  try {
    // Fetch all existing artists and albums
    const [existingArtists, existingAlbums] = await Promise.all([
      getAllArtists(),
      getAllAlbums(),
    ]);

    // Create maps for quick lookup
    const artistMap = new Map();
    existingArtists.forEach((artist) => {
      artistMap.set(artist.name.toLowerCase().trim(), artist.artistId);
    });

    const albumMap = new Map();
    existingAlbums.forEach((album) => {
      albumMap.set(album.title.toLowerCase().trim(), album.albumId);
    });

    // Process each song
    for (const row of csvData) {
      const audioUrl = row.AudioFileUrl?.trim();
      const coverImageUrl = row.CoverImageUrl?.trim() || null;

      if (!audioUrl) {
        results.failed.push({
          title: "Unknown",
          artistName: "N/A",
          error: "URL file âm thanh không được để trống",
        });
        continue;
      }

      try {
        // Extract metadata from audio file
        console.log(`Extracting metadata from: ${audioUrl}`);
        const metadata = await extractAudioMetadata(audioUrl);

        // Use metadata or fallback values
        const title = metadata.title || extractFilenameFromUrl(audioUrl);
        const artistName = metadata.artist || "Unknown Artist";
        const albumTitle = metadata.album;
        const duration = metadata.duration || 0;
        const genre = metadata.genre || null;
        const releaseDate = formatReleaseDate(metadata.releaseDate);

        // Validate extracted data
        if (!title || duration === 0) {
          results.failed.push({
            title: title || audioUrl,
            artistName: artistName,
            error: "Không thể trích xuất metadata đầy đủ từ file audio",
          });
          continue;
        }

        // Find or create artist
        let artistId;
        const artistKey = artistName.toLowerCase();

        if (artistMap.has(artistKey)) {
          artistId = artistMap.get(artistKey);
        } else {
          // Create new artist
          try {
            const newArtist = await createArtist({
              name: artistName,
              bio: "",
              profileImageUrl: null,
              verified: false,
            });
            artistId = newArtist.artistId;
            artistMap.set(artistKey, artistId);
            console.log(`Created new artist: ${artistName}`);
          } catch (error) {
            results.failed.push({
              title: title,
              artistName: artistName,
              error: `Không thể tạo ca sĩ: ${error.message}`,
            });
            continue;
          }
        }

        // Find album (set null if not found)
        let albumId = null;
        if (albumTitle && albumTitle.toLowerCase() !== "single") {
          const albumKey = albumTitle.toLowerCase();
          if (albumMap.has(albumKey)) {
            albumId = albumMap.get(albumKey);
          }
        }

        // Create song data
        const songData = {
          title: title,
          duration: duration,
          releaseDate: releaseDate,
          genre: genre,
          audioFileUrl: audioUrl,
          coverImageUrl: coverImageUrl,
          artistId: artistId,
          albumId: albumId,
          isActive: true,
        };

        // Create song
        try {
          const createdSong = await createSong(songData);
          results.successful.push({
            title: songData.title,
            artistName: artistName,
            albumTitle: albumTitle || null,
            songId: createdSong.songId,
          });
          console.log(`Successfully created song: ${title}`);
        } catch (error) {
          results.failed.push({
            title: songData.title,
            artistName: artistName,
            error: `Lỗi tạo bài hát: ${error.message}`,
          });
        }
      } catch (error) {
        results.failed.push({
          title: extractFilenameFromUrl(audioUrl),
          artistName: "N/A",
          error: `Lỗi xử lý file audio: ${error.message}`,
        });
      }
    }
  } catch (error) {
    console.error("Bulk import error:", error);
    throw new Error(`Lỗi khi nhập hàng loạt: ${error.message}`);
  }

  return results;
};

/**
 * Extract filename from URL as fallback title
 * @param {string} url - File URL
 * @returns {string} Filename without extension
 */
const extractFilenameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();
    return filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
  } catch {
    return "Unknown";
  }
};

export default songApi;
