# Firebase Integration Guide

## Overview
This application is fully integrated with Firebase Realtime Database and Firebase Storage. All data is stored in real-time and synchronized across all connected clients.

## Firebase Configuration
- **Project**: procart-8d2f6
- **Database URL**: https://procart-8d2f6-default-rtdb.firebaseio.com
- **Storage Bucket**: procart-8d2f6.firebasestorage.app

## Data Storage Strategy

### Firebase Storage (For Files)
All media files are stored in Firebase Storage:
- **Images** (.jpg, .png, .gif, .webp, etc.)
- **Videos** (.mp4, .avi, .mov, .wmv, etc.)
- **Documents** (.pdf)
- **Text files** (.txt)

**Storage Path**: `media/{timestamp}_{filename}`

### Firebase Realtime Database (For Metadata)
All other data is stored in the Realtime Database:

```
firebase-database/
├── media/
│   ├── {mediaId}/
│   │   ├── name: string
│   │   ├── type: string
│   │   ├── size: string
│   │   ├── uploadDate: ISO timestamp
│   │   ├── url: Firebase Storage URL
│   │   ├── storagePath: Storage path
│   │   ├── thumbnail: URL
│   │   └── dimensions/duration: optional
│
├── playlists/
│   ├── {playlistId}/
│   │   ├── name: string
│   │   ├── items: array
│   │   ├── schedule: object
│   │   ├── isActive: boolean
│   │   ├── lastSync: ISO timestamp
│   │   └── timestamps
│
├── devices/
│   ├── {deviceId}/
│   │   ├── name: string
│   │   ├── location: string
│   │   ├── status: string
│   │   ├── ipAddress: string
│   │   ├── metrics: object
│   │   └── timestamps
│
└── dashboard/
    ├── stats/
    │   ├── totalMedia: number
    │   ├── activePlaylists: number
    │   ├── connectedDevices: number
    │   └── storageUsed: number
    ├── recentActivity/
    │   └── {activityId}/...
    └── systemHealth/
        ├── cpu: number
        ├── memory: number
        ├── storage: number
        └── network: number
```

## Features

### ✅ Real-time Synchronization
- All changes are instantly reflected across all connected clients
- No page refresh needed
- Automatic updates using Firebase listeners

### ✅ Media Management
- Upload images, videos, PDFs to Firebase Storage
- Automatic thumbnail generation
- File size calculation and display
- Delete functionality with Storage cleanup
- Search and filter capabilities

### ✅ Playlist Management
- Create, update, delete playlists
- Drag-and-drop reordering (synced to Firebase)
- Schedule management
- Active/inactive status tracking

### ✅ Device Monitoring
- Real-time device status updates
- Metrics tracking (CPU, memory, storage, etc.)
- Connection status monitoring
- Last seen timestamps

### ✅ Dashboard Analytics
- Real-time statistics
- Activity logs for all actions
- System health monitoring
- Auto-updating metrics

### ✅ Automatic Stats Updates
- Media count updates on upload/delete
- Storage usage calculation
- Active playlists tracking
- Connected devices count

## Usage

### Uploading Media
1. Drag and drop files or click the upload area
2. Files are uploaded to Firebase Storage
3. Metadata is saved to Realtime Database
4. Dashboard stats automatically update
5. Activity is logged

### Managing Playlists
1. All playlist changes sync in real-time
2. Drag-and-drop items to reorder
3. Changes are instantly visible to all users
4. Activity logs track all modifications

### Monitoring Devices
1. Devices report status in real-time
2. Metrics update automatically
3. Connection status tracked
4. Historical data maintained

## Security Notes

⚠️ **Important**: The current Firebase configuration has public read/write access for development. 

Before deploying to production, update Firebase Rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## Initialization

The app automatically initializes Firebase on first load:
- Creates database structure
- Sets up initial stats
- Prepares collections

No manual setup required! Just start using the app.

## Troubleshooting

### No data showing?
1. Check browser console for Firebase errors
2. Verify Firebase project is active
3. Check network connection
4. Ensure Firebase rules allow access

### Upload failing?
1. Check file size (Firebase has limits)
2. Verify Storage rules
3. Check internet connection
4. Review browser console errors

### Real-time updates not working?
1. Firebase listeners may have disconnected
2. Refresh the page
3. Check Firebase quota limits
4. Verify database rules

## Performance

- Files stored directly in Firebase Storage (not in database)
- Only metadata stored in Realtime Database
- Efficient querying with filters
- Automatic cleanup on delete operations
- Optimized for multiple concurrent users
