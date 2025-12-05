# SmartVision - Web Dashboard Admin Portal

A comprehensive, fully responsive admin dashboard for managing digital signage displays on Raspberry Pi devices.

## 🚀 Features

### 1. **Dashboard Overview**
- Real-time statistics and metrics
- System health monitoring (CPU, Memory, Storage, Network)
- Recent activity feed
- Quick action buttons
- Responsive grid layout

### 2. **Media Library**
- 📤 **Drag & Drop Upload**: Intuitive file upload with visual feedback
- 🔍 **Smart Filtering**: Filter by media type (images, videos, documents, text)
- 🖼️ **Thumbnail Previews**: Visual preview of all uploaded media
- 👁️ **Preview Modal**: Full-screen preview with detailed information
- 🗑️ **CRUD Operations**: Delete, reorder, and edit media files
- 📊 **Grid/List Views**: Toggle between grid and list layouts
- 🔎 **Search Functionality**: Quick search across all media files

### 3. **Playlist Manager**
- 🎯 **Drag & Drop Builder**: Intuitive playlist sequencing with @dnd-kit
- ⏱️ **Duration Settings**: Configure display time for each media item
- 🔁 **Loop Toggle**: Enable/disable looping for individual items
- 📅 **Smart Scheduling**: 
  - Set start and end times
  - Select active days of the week
  - Visual day selector
- 📡 **Sync Status**: Real-time synchronization indicators
- 🎬 **Live Preview**: Preview playlists before deployment
- 📝 **Edit Mode**: Inline editing of playlist items
- 💾 **Auto-save**: Changes saved automatically

### 4. **Device Monitoring**
- 🟢 **Real-time Status**: Online/Offline/Warning indicators
- 📺 **Currently Playing**: View active media on each device
- 🕐 **Last Sync**: Timestamp of last successful sync
- 📊 **System Metrics**:
  - CPU usage with visual progress bars
  - Memory utilization
  - Storage capacity
  - Device temperature
  - Network uptime
- 🎛️ **Remote Control**:
  - Restart device
  - Force refresh
  - Sync now
  - Remote shutdown
- 📍 **Device Location**: Physical location tracking
- 🌐 **Network Info**: IP address and connection details

### 5. **Responsive Design**
- 📱 **Mobile-First**: Optimized for mobile devices
- 💻 **Tablet Support**: Perfect on iPads and tablets
- 🖥️ **Desktop**: Full-featured desktop experience
- 🎨 **Modern UI**: Clean, professional interface with Tailwind CSS
- 🌙 **Smooth Animations**: Polished transitions and interactions

## 🛠️ Technology Stack

- **React 19.2.0** - Latest React with modern hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **@dnd-kit** - Modern drag-and-drop library
- **React Dropzone** - File upload with drag-and-drop
- **date-fns** - Modern date utility library
- **Vite** - Lightning-fast build tool

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Project Structure

```
smart-vision/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── DashboardLayout.jsx   # Main layout wrapper
│   │       ├── Sidebar.jsx           # Navigation sidebar
│   │       └── Header.jsx            # Top header bar
│   ├── pages/
│   │   ├── Dashboard.jsx             # Overview dashboard
│   │   ├── MediaLibrary.jsx          # Media management
│   │   ├── Playlists.jsx             # Playlist builder
│   │   └── Devices.jsx               # Device monitoring
│   ├── App.jsx                       # Root component with routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
└── vite.config.js                    # Vite configuration
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

### Routing
Routes are configured in `App.jsx`:
- `/` - Dashboard
- `/media` - Media Library
- `/playlists` - Playlist Manager
- `/devices` - Device Monitoring

## 🎯 Usage

### Media Upload
1. Navigate to Media Library
2. Drag files into the upload area or click to browse
3. Files are automatically added with thumbnails
4. Use filters to organize by type
5. Click preview to view full details

### Creating Playlists
1. Go to Playlists page
2. Click "New Playlist"
3. Add media items from library
4. Drag to reorder items
5. Set duration and loop settings
6. Configure schedule (time and days)
7. Preview before deploying

### Monitoring Devices
1. Access Devices page
2. View all connected Raspberry Pi devices
3. Check real-time status and metrics
4. Click "Details" for in-depth information
5. Use remote controls (restart, sync, shutdown)

## 🚀 Features in Detail

### Drag & Drop
- Smooth animations with @dnd-kit
- Visual feedback during dragging
- Keyboard navigation support
- Touch screen compatible

### Responsive Design
- Mobile sidebar with hamburger menu
- Collapsible navigation
- Adaptive grid layouts
- Touch-optimized controls

### Real-time Updates
- Status indicators update automatically
- Sync timestamps with relative time
- Live system metrics
- Activity feed updates

## 🎨 Design System

### Colors
- **Primary**: Indigo (Playlists, CTAs)
- **Success**: Green (Online, Success states)
- **Warning**: Orange (Warnings, Alerts)
- **Danger**: Red (Offline, Errors)
- **Gray Scale**: Professional neutral tones

### Typography
- **Font**: Inter, System UI fallbacks
- **Sizes**: Responsive with Tailwind utilities
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Future Enhancements

- [ ] Authentication and user management
- [ ] Real-time WebSocket connections
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Bulk operations
- [ ] Export/Import functionality
- [ ] Role-based access control

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ for SmartVision Digital Signage System
