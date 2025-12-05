// Firebase Database Initialization Script
// Run this once to populate your Firebase database with initial data

import { ref, set } from 'firebase/database';
import { database } from './config';

export const initializeDatabase = async () => {
  try {
    // Initialize Dashboard Stats
    await set(ref(database, 'dashboard/stats'), {
      totalMedia: 0,
      activePlaylists: 0,
      connectedDevices: 0,
      storageUsed: 0,
      lastUpdated: new Date().toISOString()
    });

    // Initialize System Health
    await set(ref(database, 'dashboard/systemHealth'), {
      cpu: 32,
      memory: 58,
      storage: 68,
      network: 23,
      timestamp: new Date().toISOString()
    });

    // Initialize Sample Activity
    await set(ref(database, 'dashboard/recentActivity'), {});

    // Initialize empty collections
    await set(ref(database, 'media'), {});
    await set(ref(database, 'playlists'), {});
    await set(ref(database, 'devices'), {});

    console.log('✅ Firebase database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

// Optional: Add sample devices
export const addSampleDevices = async () => {
  try {
    const sampleDevices = {
      'device-1': {
        name: 'Device-01',
        location: 'Main Entrance',
        status: 'online',
        currentMedia: null,
        playlist: null,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.101',
        uptime: '5 days 12 hours',
        metrics: {
          cpu: 35,
          memory: 58,
          temperature: 52,
          storage: 68
        },
        createdAt: new Date().toISOString()
      },
      'device-2': {
        name: 'Device-02',
        location: 'Back Office',
        status: 'online',
        currentMedia: null,
        playlist: null,
        lastSeen: new Date().toISOString(),
        ipAddress: '192.168.1.102',
        uptime: '3 days 8 hours',
        metrics: {
          cpu: 42,
          memory: 65,
          temperature: 55,
          storage: 45
        },
        createdAt: new Date().toISOString()
      }
    };

    await set(ref(database, 'devices'), sampleDevices);
    console.log('✅ Sample devices added successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding sample devices:', error);
    return false;
  }
};

// Call this function once to initialize
// initializeDatabase();
// addSampleDevices();
