// This script adds sample data to Firebase for testing
// Run this from browser console: window.addSampleData()

import { addDevice } from './deviceService';
import { createPlaylist } from './playlistService';
import { logActivity, updateSystemHealth } from './dashboardService';

export const addSampleData = async () => {
  try {
    console.log('Adding sample data to Firebase...');

    // Add sample devices
    await addDevice({
      name: 'Device-01',
      location: 'Main Entrance',
      ipAddress: '192.168.1.101',
      status: 'online',
      uptime: '5 days 12 hours',
      cpu: 35,
      memory: 58,
      temperature: 52,
      storage: 68
    });

    await addDevice({
      name: 'Device-02',
      location: 'Back Office',
      ipAddress: '192.168.1.102',
      status: 'online',
      uptime: '3 days 8 hours',
      cpu: 42,
      memory: 65,
      temperature: 55,
      storage: 45
    });

    await addDevice({
      name: 'Device-03',
      location: 'Customer Service',
      ipAddress: '192.168.1.103',
      status: 'offline'
    });

    // Add sample playlists
    await createPlaylist({
      name: 'Store Front Display',
      items: [],
      schedule: { start: '09:00', end: '21:00', days: [1, 2, 3, 4, 5, 6, 0] },
      isActive: true
    });

    await createPlaylist({
      name: 'Weekend Promotions',
      items: [],
      schedule: { start: '10:00', end: '20:00', days: [6, 0] },
      isActive: false
    });

    // Add sample activities
    await logActivity('System initialized', {
      details: 'Sample data added',
      file: 'system',
      device: 'Admin'
    });

    await logActivity('Devices added', {
      details: '3 devices registered',
      file: 'system',
      device: 'Admin'
    });

    // Update system health
    await updateSystemHealth({
      cpu: 32,
      memory: 58,
      storage: 45,
      network: 23
    });

    console.log('✅ Sample data added successfully!');
    alert('Sample data added to Firebase!');
  } catch (error) {
    console.error('Error adding sample data:', error);
    alert('Failed to add sample data. Check console for details.');
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  window.addSampleData = addSampleData;
}
