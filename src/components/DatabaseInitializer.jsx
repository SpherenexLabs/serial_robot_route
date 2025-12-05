import { useState } from 'react';
import { initializeDatabase, addSampleDevices } from '../firebase/initDatabase';

const DatabaseInitializer = ({ onComplete }) => {
  const [status, setStatus] = useState('ready');
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setStatus('loading');
    setMessage('Initializing Firebase database...');

    const dbInitSuccess = await initializeDatabase();
    if (dbInitSuccess) {
      setMessage('Database initialized. Adding sample devices...');
      const devicesSuccess = await addSampleDevices();
      
      if (devicesSuccess) {
        setStatus('success');
        setMessage('✅ Database setup complete! You can now start using the application.');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 2000);
      } else {
        setStatus('error');
        setMessage('❌ Failed to add sample devices. Please try again.');
      }
    } else {
      setStatus('error');
      setMessage('❌ Failed to initialize database. Please check your Firebase configuration.');
    }
  };

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to SmartVision
        </h2>
        
        {status === 'ready' && (
          <>
            <p className="text-gray-600 mb-6">
              It looks like this is your first time. Would you like to initialize the database with sample data?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleInitialize}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Initialize Database
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Skip
              </button>
            </div>
          </>
        )}

        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <>
            <div className="text-center mb-4">
              <div className="text-red-600 text-5xl mb-4">✕</div>
              <p className="text-gray-600">{message}</p>
            </div>
            <button
              onClick={handleInitialize}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DatabaseInitializer;
