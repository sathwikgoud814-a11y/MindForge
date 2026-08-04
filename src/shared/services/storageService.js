import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload image or file to Firebase Storage
 * @param {string} path - Storage path e.g. 'avatars/user123.png'
 * @param {File | Blob} file - File binary
 * @returns {Promise<string>} Download URL
 */
export const uploadFileToStorage = async (path, file) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.error('[Firebase Storage Upload Error]:', err.message);
    throw err;
  }
};
