import { ref, onValue, push, set, remove, update, get } from 'firebase/database';
import { database } from './config';

// Devices CRUD operations
export const subscribeToDevices = (callback) => {
  const devicesRef = ref(database, 'devices');
  return onValue(devicesRef, (snapshot) => {
    const data = snapshot.val();
    const devicesArray = data ? Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).filter(item => item.name) : []; // Filter out empty objects
    callback(devicesArray);
  });
};

export const addDevice = async (deviceData) => {
  try {
    const devicesRef = ref(database, 'devices');
    const newDeviceRef = push(devicesRef);
    
    const device = {
      name: deviceData.name || 'New Device',
      location: deviceData.location || 'Unknown',
      ipAddress: deviceData.ipAddress || '0.0.0.0',
      status: 'online',
      currentMedia: null,
      playlist: null,
      uptime: '0 hours',
      cpu: 0,
      memory: 0,
      temperature: 0,
      storage: 0,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await set(newDeviceRef, device);
    
    // Update stats
    await updateDeviceStats();
    
    return { id: newDeviceRef.key, ...device };
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
};

// Auto-update device stats
const updateDeviceStats = async () => {
  try {
    const devicesRef = ref(database, 'devices');
    const snapshot = await get(devicesRef);
    const data = snapshot.val();
    const connectedDevices = data 
      ? Object.values(data).filter(d => d.status === 'online' && d.name).length 
      : 0;

    const statsRef = ref(database, 'dashboard/stats');
    await update(statsRef, {
      connectedDevices,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating device stats:', error);
  }
};

export const updateDevice = async (deviceId, updates) => {
  try {
    const deviceRef = ref(database, `devices/${deviceId}`);
    const updatedData = {
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    await update(deviceRef, updatedData);
    
    // Update stats if status changed
    if (updates.status !== undefined) {
      await updateDeviceStats();
    }
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};

export const deleteDevice = async (deviceId) => {
  try {
    const deviceRef = ref(database, `devices/${deviceId}`);
    await remove(deviceRef);
    
    // Update stats
    await updateDeviceStats();
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};

export const updateDeviceStatus = async (deviceId, status) => {
  try {
    const deviceRef = ref(database, `devices/${deviceId}`);
    await update(deviceRef, {
      status,
      lastSeen: new Date().toISOString()
    });
    
    // Update stats
    await updateDeviceStats();
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
};

// Subscribe to device metrics (for real-time monitoring)
export const subscribeToDeviceMetrics = (deviceId, callback) => {
  const metricsRef = ref(database, `devices/${deviceId}/metrics`);
  return onValue(metricsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const updateDeviceMetrics = async (deviceId, metrics) => {
  try {
    const metricsRef = ref(database, `devices/${deviceId}/metrics`);
    await set(metricsRef, {
      ...metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating device metrics:', error);
    throw error;
  }
};
