import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Monitor,
  Power,
  RefreshCw,
  Wifi,
  WifiOff,
  Play,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Thermometer,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { subscribeToDevices, updateDeviceStatus } from '../firebase/deviceService';
import { logActivity } from '../firebase/dashboardService';

const Devices = () => {
  const { setPageTitle } = useOutletContext();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setPageTitle('Devices');

    // Subscribe to real-time device updates
    const unsubscribe = subscribeToDevices((devicesData) => {
      setDevices(devicesData);
    });

    return () => unsubscribe();
  }, [setPageTitle]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle size={20} />;
      case 'offline':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const handleDeviceAction = (deviceId, action) => {
    console.log(`Action: ${action} on device ${deviceId}`);
    // Implement actual device control here
  };

  const viewDeviceDetails = (device) => {
    setSelectedDevice(device);
    setShowDetails(true);
  };

  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const offlineDevices = devices.filter((d) => d.status === 'offline').length;
  const warningDevices = devices.filter((d) => d.status === 'warning').length;

  return (
    <div className="devices-container">
      {/* Stats Overview */}
      <div className="devices-stats">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{devices.length}</p>
            </div>
            <div className="bg-indigo-500 p-4 rounded-lg">
              <Monitor size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{onlineDevices}</p>
            </div>
            <div className="bg-green-500 p-4 rounded-lg">
              <Wifi size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{offlineDevices}</p>
            </div>
            <div className="bg-red-500 p-4 rounded-lg">
              <WifiOff size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{warningDevices}</p>
            </div>
            <div className="bg-orange-500 p-4 rounded-lg">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{device.location}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(device.status)}`}>
                  {getStatusIcon(device.status)}
                  <span className="text-sm font-medium capitalize">{device.status}</span>
                </div>
              </div>

              {/* Currently Playing */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Play size={14} />
                  <span className="font-medium">Currently Playing:</span>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {device.currentMedia || 'No media playing'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Playlist: {device.playlist}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-medium text-gray-900">{device.ipAddress}</span>
              </div>

              {device.status !== 'offline' && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium text-gray-900">{device.uptime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CPU:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            device.cpu > 70 ? 'bg-red-500' : device.cpu > 50 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${device.cpu}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900">{device.cpu}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Memory:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            device.memory > 80 ? 'bg-red-500' : device.memory > 60 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${device.memory}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900">{device.memory}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Temperature:</span>
                    <span className={`font-medium ${device.temperature > 65 ? 'text-red-600' : 'text-gray-900'}`}>
                      {device.temperature}°C
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                <Clock size={12} />
                <span>Last sync: {formatDistanceToNow(device.lastSync, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => handleDeviceAction(device.id, 'refresh')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={device.status === 'offline'}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={() => handleDeviceAction(device.id, 'restart')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={device.status === 'offline'}
              >
                <Power size={16} />
                Restart
              </button>
              <button
                onClick={() => viewDeviceDetails(device)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Device Details Modal */}
      {showDetails && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedDevice.location}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Connection Status</p>
                    <div className={`flex items-center gap-2 ${getStatusColor(selectedDevice.status)} px-3 py-1 rounded-full inline-flex`}>
                      {getStatusIcon(selectedDevice.status)}
                      <span className="text-sm font-medium capitalize">{selectedDevice.status}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Last Sync</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDistanceToNow(selectedDevice.lastSync, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Currently Playing */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Playback</h4>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-indigo-700 mb-2">
                    <Play size={16} />
                    <span className="font-medium">Currently Playing</span>
                  </div>
                  <p className="text-lg font-semibold text-indigo-900">
                    {selectedDevice.currentMedia || 'No media playing'}
                  </p>
                  <p className="text-sm text-indigo-700 mt-1">
                    From playlist: {selectedDevice.playlist}
                  </p>
                </div>
              </div>

              {/* System Info */}
              {selectedDevice.status !== 'offline' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">System Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Cpu size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">CPU Usage</p>
                          <p className="text-xs text-gray-500">Processor load</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{selectedDevice.cpu}%</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedDevice.cpu > 70 ? 'bg-red-500' : selectedDevice.cpu > 50 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${selectedDevice.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Memory Usage</p>
                          <p className="text-xs text-gray-500">RAM utilization</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{selectedDevice.memory}%</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedDevice.memory > 80 ? 'bg-red-500' : selectedDevice.memory > 60 ? 'bg-orange-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${selectedDevice.memory}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <HardDrive size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Storage Usage</p>
                          <p className="text-xs text-gray-500">Disk space</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{selectedDevice.storage}%</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedDevice.storage > 90 ? 'bg-red-500' : selectedDevice.storage > 70 ? 'bg-orange-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${selectedDevice.storage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Thermometer size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Temperature</p>
                          <p className="text-xs text-gray-500">Device temperature</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${selectedDevice.temperature > 65 ? 'text-red-600' : 'text-gray-900'}`}>
                          {selectedDevice.temperature}°C
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Network Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Network</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">IP Address</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDevice.ipAddress}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Uptime</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDevice.uptime || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Remote Control</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDeviceAction(selectedDevice.id, 'sync')}
                    className="flex flex-col items-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                    disabled={selectedDevice.status === 'offline'}
                  >
                    <RefreshCw size={24} className="text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">Sync Now</span>
                  </button>
                  <button
                    onClick={() => handleDeviceAction(selectedDevice.id, 'restart')}
                    className="flex flex-col items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                    disabled={selectedDevice.status === 'offline'}
                  >
                    <Power size={24} className="text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Restart</span>
                  </button>
                  <button
                    onClick={() => handleDeviceAction(selectedDevice.id, 'shutdown')}
                    className="flex flex-col items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    disabled={selectedDevice.status === 'offline'}
                  >
                    <Power size={24} className="text-red-600" />
                    <span className="text-sm font-medium text-red-900">Shutdown</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
