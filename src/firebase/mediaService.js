import { ref, onValue, push, set, remove, update, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage } from './config';

// Media CRUD operations
export const subscribeToMedia = (callback) => {
  const mediaRef = ref(database, 'media');
  return onValue(mediaRef, (snapshot) => {
    const data = snapshot.val();
    const mediaArray = data ? Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).filter(item => item.name) : []; // Filter out empty objects
    callback(mediaArray);
  });
};

export const uploadMedia = async (file, metadata) => {
  try {
    // Get file name (works with both File and Blob)
    const fileName = file.name || `file-${Date.now()}`;
    
    // Upload file to Firebase Storage (for images, videos, PDFs)
    const fileRef = storageRef(storage, `media/${Date.now()}_${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Calculate file size in MB or KB
    const fileSizeInBytes = file.size || 0;
    let formattedSize;
    if (metadata.size) {
      // Use metadata size if provided (for text content)
      formattedSize = metadata.size;
    } else if (fileSizeInBytes >= 1048576) {
      formattedSize = `${(fileSizeInBytes / 1048576).toFixed(2)} MB`;
    } else if (fileSizeInBytes >= 1024) {
      formattedSize = `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      formattedSize = `${fileSizeInBytes} Bytes`;
    }

    // Save metadata to Realtime Database
    const mediaRef = ref(database, 'media');
    const newMediaRef = push(mediaRef);
    
    const mediaData = {
      name: fileName,
      type: metadata.type,
      size: formattedSize,
      uploadDate: new Date().toISOString(),
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      thumbnail: metadata.thumbnail || downloadURL,
      dimensions: metadata.dimensions || null,
      duration: metadata.duration || null,
      textContent: metadata.textContent || null,
      textStyle: metadata.textStyle || null
    };

    await set(newMediaRef, mediaData);

    // Update stats
    await updateMediaStats();
    
    return { id: newMediaRef.key, ...mediaData };
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

// Auto-update media stats
const updateMediaStats = async () => {
  try {
    const mediaRef = ref(database, 'media');
    const snapshot = await get(mediaRef);
    const data = snapshot.val();
    const mediaCount = data ? Object.keys(data).filter(key => data[key].name).length : 0;

    // Calculate total storage used
    let totalStorage = 0;
    if (data) {
      Object.values(data).forEach(item => {
        if (item.size) {
          const sizeStr = item.size;
          const value = parseFloat(sizeStr);
          if (sizeStr.includes('MB')) {
            totalStorage += value;
          } else if (sizeStr.includes('KB')) {
            totalStorage += value / 1024;
          }
        }
      });
    }

    const statsRef = ref(database, 'dashboard/stats');
    await update(statsRef, {
      totalMedia: mediaCount,
      storageUsed: totalStorage.toFixed(2),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating media stats:', error);
  }
};

export const deleteMedia = async (mediaId, storagePath) => {
  try {
    // Delete from Storage
    if (storagePath) {
      const fileRef = storageRef(storage, storagePath);
      await deleteObject(fileRef);
    }

    // Delete from Database
    const mediaRef = ref(database, `media/${mediaId}`);
    await remove(mediaRef);

    // Update stats
    await updateMediaStats();
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};

export const updateMedia = async (mediaId, updates) => {
  try {
    const mediaRef = ref(database, `media/${mediaId}`);
    await update(mediaRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating media:', error);
    throw error;
  }
};
