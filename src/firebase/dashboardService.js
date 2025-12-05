import { ref, onValue, push, set } from 'firebase/database';
import { database } from './config';

// Dashboard stats and activity
export const subscribeToDashboardStats = (callback) => {
  const statsRef = ref(database, 'dashboard/stats');
  return onValue(statsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
};

export const subscribeToRecentActivity = (callback) => {
  const activityRef = ref(database, 'dashboard/recentActivity');
  return onValue(activityRef, (snapshot) => {
    const data = snapshot.val();
    const activityArray = data ? Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
    callback(activityArray);
  });
};

export const subscribeToSystemHealth = (callback) => {
  const healthRef = ref(database, 'dashboard/systemHealth');
  return onValue(healthRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
};

export const logActivity = async (action, details) => {
  try {
    const activityRef = ref(database, 'dashboard/recentActivity');
    const newActivityRef = push(activityRef);
    
    const activity = {
      action,
      ...details,
      timestamp: new Date().toISOString()
    };

    await set(newActivityRef, activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

export const updateDashboardStats = async (stats) => {
  try {
    const statsRef = ref(database, 'dashboard/stats');
    await set(statsRef, {
      ...stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    throw error;
  }
};

export const updateSystemHealth = async (health) => {
  try {
    const healthRef = ref(database, 'dashboard/systemHealth');
    await set(healthRef, {
      ...health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating system health:', error);
    throw error;
  }
};
