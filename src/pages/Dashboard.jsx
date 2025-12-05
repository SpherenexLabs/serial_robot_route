import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Monitor, 
  Upload, 
  PlaySquare, 
  HardDrive, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { 
  subscribeToDashboardStats, 
  subscribeToRecentActivity, 
  subscribeToSystemHealth 
} from '../firebase/dashboardService';
import { subscribeToMedia } from '../firebase/mediaService';
import { subscribeToPlaylists } from '../firebase/playlistService';
import { subscribeToDevices } from '../firebase/deviceService';

const Dashboard = () => {
  const { setPageTitle } = useOutletContext();
  const [stats, setStats] = useState({
    totalMedia: 0,
    activePlaylists: 0,
    // connectedDevices: 0,  // Commented - To be implemented later
    // storageUsed: 0        // Commented - To be implemented later
  });
  const [recentActivity, setRecentActivity] = useState([]);
  // System Health - Commented out for now, will implement later
  // const [systemHealth, setSystemHealth] = useState({
  //   cpu: 0,
  //   memory: 0,
  //   storage: 0,
  //   network: 0
  // });

  useEffect(() => {
    console.log('Dashboard mounted');
    setPageTitle('Dashboard');

    // Subscribe to real-time updates
    // const unsubscribeStats = subscribeToDashboardStats(setStats);
    const unsubscribeActivity = subscribeToRecentActivity((activity) => {
      console.log('Received activity data:', activity);
      setRecentActivity(activity);
    });
    // const unsubscribeHealth = subscribeToSystemHealth(setSystemHealth); // Commented - To be implemented later

    // Calculate stats from individual services
    const unsubscribeMedia = subscribeToMedia((media) => {
      console.log('Received media data:', media.length);
      setStats(prev => ({ ...prev, totalMedia: media.length }));
    });

    const unsubscribePlaylists = subscribeToPlaylists((playlists) => {
      console.log('Received playlists data:', playlists.length);
      const activePlaylists = playlists.filter(p => p.isActive).length;
      setStats(prev => ({ ...prev, activePlaylists }));
    });

    // Devices - Commented out for now, will implement later
    // const unsubscribeDevices = subscribeToDevices((devices) => {
    //   const connectedDevices = devices.filter(d => d.status === 'online').length;
    //   setStats(prev => ({ ...prev, connectedDevices }));
    // });

    return () => {
      // unsubscribeStats();
      unsubscribeActivity();
      // unsubscribeHealth();
      unsubscribeMedia();
      unsubscribePlaylists();
      // unsubscribeDevices();
    };
  }, [setPageTitle]);

  const statsCards = [
    {
      icon: Upload,
      label: 'Total Media Files',
      value: stats.totalMedia?.toString() || '0',
      change: 'Uploaded files',
      changeType: 'neutral',
      color: 'blue-500',
    },
    {
      icon: PlaySquare,
      label: 'Active Playlists',
      value: stats.activePlaylists?.toString() || '0',
      change: 'Currently active',
      changeType: 'neutral',
      color: 'green-500',
    },
    // Connected Devices - Commented out, will implement later
    // {
    //   icon: Monitor,
    //   label: 'Connected Devices',
    //   value: stats.connectedDevices?.toString() || '0',
    //   change: '2 offline',
    //   changeType: 'warning',
    //   color: 'purple-500',
    // },
    // Storage Used - Commented out, will implement later
    // {
    //   icon: HardDrive,
    //   label: 'Storage Used',
    //   value: stats.storageUsed ? `${stats.storageUsed} GB` : '0 GB',
    //   change: '68% of 66 GB',
    //   changeType: 'neutral',
    //   color: 'orange-500',
    // },
  ];

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <div className="dashboard-stats">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Activity size={20} />
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 6).map((activity, index) => (
                <div key={activity.id || index} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-details">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-file">{activity.file || activity.details}</p>
                    <p className="activity-time">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* System Health - Commented out, will implement later */}
      {/* 
      <div className="card">
        <div className="card-header">
          <h3>System Health</h3>
          <TrendingUp size={20} />
        </div>
        <div className="health-metrics">
          <div className="metric">
            <div className="metric-header">
              <span>CPU Usage</span>
              <span className="metric-value">{systemHealth.cpu || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: `${systemHealth.cpu || 0}%` }}></div>
            </div>
          </div>
          <div className="metric">
            <div className="metric-header">
              <span>Memory Usage</span>
              <span className="metric-value">{systemHealth.memory || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill blue" style={{ width: `${systemHealth.memory || 0}%` }}></div>
            </div>
          </div>
          <div className="metric">
            <div className="metric-header">
              <span>Storage Usage</span>
              <span className="metric-value">{systemHealth.storage || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill orange" style={{ width: `${systemHealth.storage || 0}%` }}></div>
            </div>
          </div>
          <div className="metric">
            <div className="metric-header">
              <span>Network Traffic</span>
              <span className="metric-value">{systemHealth.network || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill purple" style={{ width: `${systemHealth.network || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Quick Actions - Commented out, will implement later */}
      {/*
      <div className="card">
        <h3 className="card-title">Quick Actions</h3>
        <div className="quick-actions">
          <button className="quick-action-btn">
            <Upload size={24} />
            <span>Upload Media</span>
          </button>
          <button className="quick-action-btn">
            <PlaySquare size={24} />
            <span>New Playlist</span>
          </button>
          <button className="quick-action-btn">
            <Monitor size={24} />
            <span>Sync Devices</span>
          </button>
          <button className="quick-action-btn">
            <Activity size={24} />
            <span>View Reports</span>
          </button>
        </div>
      </div>
      */}
    </div>
  );
};

export default Dashboard;
