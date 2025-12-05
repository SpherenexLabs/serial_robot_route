import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';

export const useFirebaseStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    hasPermission: false,
    error: null,
    checking: true
  });

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        // Try to read from database to check permissions
        const testRef = ref(database, 'dashboard/stats');
        await get(testRef);
        
        // If we get here without error, permissions are OK
        setStatus({
          connected: true,
          hasPermission: true,
          error: null,
          checking: false
        });
      } catch (error) {
        console.error('Firebase connection error:', error);
        
        let errorMessage = 'Firebase connection failed';
        
        if (error.code === 'PERMISSION_DENIED' || error.message?.includes('Permission denied')) {
          errorMessage = 'Firebase permission denied. Please update Firebase Security Rules.';
        } else if (error.message?.includes('network')) {
          errorMessage = 'Network error. Check your internet connection.';
        }
        
        setStatus({
          connected: false,
          hasPermission: false,
          error: errorMessage,
          checking: false
        });
      }
    };

    checkFirebaseConnection();
  }, []);

  return status;
};
