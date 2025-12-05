import { AlertTriangle, CheckCircle, Loader, XCircle } from 'lucide-react';
import './FirebaseStatus.css';

const FirebaseStatus = ({ status }) => {
  if (status.checking) {
    return (
      <div className="firebase-status checking">
        <Loader size={20} className="spinner" />
        <span>Connecting to Firebase...</span>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="firebase-status error">
        <XCircle size={20} />
        <div className="status-content">
          <strong>Firebase Error</strong>
          <p>{status.error}</p>
          <a 
            href="https://console.firebase.google.com/project/procart-8d2f6/database/procart-8d2f6-default-rtdb/rules" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fix-link"
          >
            Click here to update Firebase Rules
          </a>
        </div>
      </div>
    );
  }

  if (status.connected && status.hasPermission) {
    return (
      <div className="firebase-status success">
        <CheckCircle size={20} />
        <span>Connected to Firebase</span>
      </div>
    );
  }

  return null;
};

export default FirebaseStatus;
