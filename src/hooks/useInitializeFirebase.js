import { useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase/config';

export const useInitializeFirebase = () => {
  useEffect(() => {
    const initializeIfNeeded = async () => {
      try {
        // Check if database is already initialized
        const statsRef = ref(database, 'dashboard/stats');
        const snapshot = await get(statsRef);
        
        if (!snapshot.exists()) {
          console.log('Initializing Firebase database...');
          
          // Initialize Dashboard Stats
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

          // Initialize empty collections with placeholder
          const mediaRef = ref(database, 'media/_placeholder');
          await set(mediaRef, true);

          const playlistsRef = ref(database, 'playlists/_placeholder');
          await set(playlistsRef, true);

          const devicesRef = ref(database, 'devices/_placeholder');
          await set(devicesRef, true);

          const activityRef = ref(database, 'dashboard/recentActivity/_placeholder');
          await set(activityRef, true);

          console.log('✅ Firebase initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeIfNeeded();
  }, []);
};
