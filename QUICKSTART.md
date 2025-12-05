# SmartVision Admin Portal - Quick Start Guide

## 🚀 Getting Started

Your SmartVision Admin Portal is now ready! The application is running at:

**Local URL**: http://localhost:5174/

## ✅ What's Included

### 1. **Dashboard** (/)
- System overview with statistics
- Real-time metrics (CPU, Memory, Storage, Network)
- Recent activity feed
- Quick action buttons

### 2. **Media Library** (/media)
- Drag & drop file uploads
- Filter by type: Images, Videos, Documents, Text
- Grid/List view toggle
- Search functionality
- Preview and delete capabilities

### 3. **Playlists** (/playlists)
- Create and manage playlists
- Drag & drop to reorder items
- Set duration for each media item
- Enable/disable looping
- Schedule by time and days
- Preview functionality

### 4. **Devices** (/devices)
- Monitor all Raspberry Pi devices
- View online/offline status
- Check system metrics (CPU, Memory, Temperature, Storage)
- Remote controls (Restart, Refresh, Sync, Shutdown)
- Detailed device information

## 🎯 Quick Actions

### Upload Media
1. Click "Media Library" in sidebar
2. Drag files into upload area (or click to browse)
3. Supported: Images (JPG, PNG, GIF), Videos (MP4, AVI, MOV), Documents (PDF), Text files

### Create a Playlist
1. Go to "Playlists"
2. Click "New Playlist"
3. Add media items
4. Drag to reorder
5. Set duration for each item
6. Configure schedule (start/end time, active days)
7. Click "Preview" to test

### Monitor Devices
1. Navigate to "Devices"
2. View all connected devices
3. Click "Details" for in-depth metrics
4. Use remote control buttons as needed

## 📱 Mobile Access

The dashboard is fully responsive:
- **Mobile**: Use hamburger menu (☰) to access navigation
- **Tablet**: Optimized layout for iPad
- **Desktop**: Full sidebar navigation

## 🎨 Features Highlights

### Drag & Drop
- Upload files by dragging into the media library
- Reorder playlist items by dragging
- Touch-friendly on mobile devices

### Filtering & Search
- Filter media by type (All, Images, Videos, Documents)
- Search across all media files
- Toggle between Grid and List views

### Scheduling
- Set specific time ranges for playlists
- Select active days of the week
- Multiple playlists with different schedules

### Device Control
- Real-time status monitoring
- Remote restart/refresh/shutdown
- View current playing media
- Check system health metrics

## 🔧 Technical Details

### Technologies Used
- React 19.2.0
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- @dnd-kit (Drag & Drop)
- React Dropzone
- date-fns

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- The app uses mock data for demonstration
- Device monitoring shows simulated metrics
- To connect real Raspberry Pi devices, backend API integration is needed
- Media uploads currently store files in browser memory

## 🚀 Next Steps

1. **Backend Integration**: Connect to your API endpoints for real data
2. **Authentication**: Add user login and authentication
3. **WebSocket**: Implement real-time updates for device monitoring
4. **File Storage**: Configure cloud storage for media files (AWS S3, etc.)
5. **Database**: Connect to your database for persistent storage

## 🆘 Troubleshooting

### Port Already in Use
If you see "Port 5173 is in use", the app will automatically use the next available port (5174, 5175, etc.)

### Tailwind Not Working
Make sure `tailwind.config.js` and `postcss.config.js` are in the root directory.

### Icons Not Showing
Run `npm install` to ensure all dependencies are installed.

## 📚 Documentation

Full documentation is available in `README.md`.

## 🎉 Enjoy!

Your SmartVision Admin Portal is ready to use. Start by uploading some media and creating your first playlist!

---

**Current Status**: ✅ Development server running on http://localhost:5174/
