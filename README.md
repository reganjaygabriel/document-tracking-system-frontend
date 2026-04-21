# Document Tracking System - Frontend

A modern, responsive dashboard for document tracking and management built with Vue 3 and Tailwind CSS.

## Features

- 📊 **Dashboard Overview** - Real-time statistics and document status
- 📄 **Document Management** - View, search, and filter documents
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Quick document search and status filtering
- 📈 **Analytics** - Document status overview with visual progress bars

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Official router for Vue.js
- **Vite** - Next generation frontend tooling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── views/
│   │   └── Dashboard.vue      # Main dashboard component
│   ├── router/
│   │   └── index.js           # Vue Router configuration
│   ├── App.vue                # Root component
│   ├── main.js                # Application entry point
│   └── style.css              # Global styles with Tailwind
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Project dependencies

```

## Dashboard Features

### Statistics Cards
- Total Documents count
- Pending Review count
- Approved documents count
- Rejected documents count

### Document Status Overview
- Visual progress bars showing document distribution
- Real-time percentage calculations

### Recent Documents Table
- Document name with file type icons
- Owner information with avatars
- Status badges with color coding
- Last modified timestamps
- Quick actions (View, Edit, Delete)

### Quick Actions
- Upload Document
- Create Report
- Scan Document
- Export Data

### Search & Filter
- Real-time search across document names, types, and owners
- Filter by document status (All, Pending, Approved, Rejected, In Review)

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Mock Data
The dashboard currently uses mock data. To connect to a real backend:

1. Update the `documents` array in `Dashboard.vue` to fetch from your API
2. Add API service files in `src/services/`
3. Implement state management if needed (Vuex or Pinia)

## Future Enhancements

- [ ] User authentication
- [ ] Real-time notifications
- [ ] Document upload functionality
- [ ] Advanced filtering and sorting
- [ ] Document preview
- [ ] Export to CSV/PDF
- [ ] Dark mode support
- [ ] Multi-language support

## License

MIT
