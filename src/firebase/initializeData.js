import { ref, set, push } from 'firebase/database';
import { database } from './config';

// Initialize Firebase with sample data (run this once)
export const initializeFirebaseData = async () => {
  try {
    console.log('Initializing Firebase data...');

    // Initialize Dashboard Stats
    const statsRef = ref(database, 'dashboard/stats');
    await set(statsRef, {
      totalMedia: 0,
      activePlaylists: 0,
      connectedDevices: 0,
      storageUsed: 0,
      lastUpdated: new Date().toISOString()
    });

    // Initialize System Health
    const healthRef = ref(database, 'dashboard/systemHealth');
    await set(healthRef, {
      cpu: 32,
      memory: 58,
      storage: 45,
      network: 23,
      timestamp: new Date().toISOString()
    });

    // Add initial activity log
    const activityRef = ref(database, 'dashboard/recentActivity');
    const newActivityRef = push(activityRef);
    await set(newActivityRef, {
      action: 'System initialized',
      details: 'Firebase database initialized',
      file: 'system',
      device: 'Admin',
      timestamp: new Date().toISOString()
    });

    // Initialize empty collections (optional)
    const mediaRef = ref(database, 'media');
    await set(mediaRef, {});

    const playlistsRef = ref(database, 'playlists');
    await set(playlistsRef, {});

    const devicesRef = ref(database, 'devices');
    await set(devicesRef, {});

    console.log('Firebase initialization complete!');
    return { success: true };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Helper function to update dashboard stats automatically
export const updateStatsAutomatically = async (type, operation) => {
  try {
    const statsRef = ref(database, 'dashboard/stats');
    const currentStats = await get(statsRef);
    const stats = currentStats.val() || { totalMedia: 0, activePlaylists: 0, connectedDevices: 0, storageUsed: 0 };

    switch (type) {
      case 'media':
        stats.totalMedia = operation === 'add' ? stats.totalMedia + 1 : Math.max(0, stats.totalMedia - 1);
        break;
      case 'playlist':
        stats.activePlaylists = operation === 'add' ? stats.activePlaylists + 1 : Math.max(0, stats.activePlaylists - 1);
        break;
      case 'device':
        stats.connectedDevices = operation === 'add' ? stats.connectedDevices + 1 : Math.max(0, stats.connectedDevices - 1);
        break;
    }

    stats.lastUpdated = new Date().toISOString();
    await set(statsRef, stats);
  } catch (error) {
    console.error('Error updating stats:', error);
  }
};
