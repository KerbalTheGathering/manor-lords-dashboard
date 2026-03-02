# Manor Lords Dashboard

A medieval settlement management companion built on Model Context Protocol (MCP). Provides real-time visualization and AI-powered strategic analysis of Manor Lords settlement data through a period-accurate medieval interface.

## Features

- **Settlement Overview** - Population, approval, food stores, housing, and treasury at a glance
- **Resource Flow** - Sankey-style production chain visualization with bottleneck detection
- **Military Readiness** - Troop composition, equipment stockpile, and threat assessment
- **AI Strategy Console** - Claude-powered strategic advice scoped to your settlement data

## Tech Stack

- **Electron 33+** - Desktop shell with full filesystem access
- **React 18 + TypeScript** - Component-based UI with hooks
- **Tailwind CSS** - Utility-first styling with medieval design tokens
- **Recharts** - Charts with custom medieval-styled rendering
- **MCP Server** - Model Context Protocol for structured game data access
- **Claude API** - AI-powered strategic analysis

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Launch (Windows)

```powershell
.\Start-ManorLordsDashboard.ps1
```

For development mode with hot reload:

```powershell
.\Start-ManorLordsDashboard.ps1 -Dev
```

### Manual Launch

```bash
npm install
npm run dev        # Vite dev server (browser only)
npm run electron:dev  # Full Electron + Vite dev
```

### AI Strategy Console

To enable Claude-powered strategic advice, set your API key in `.env`:

```
ANTHROPIC_API_KEY=your-key-here
```

## Project Structure

```
manor-lords-dashboard/
├── electron/          # Electron main process & IPC
├── src/
│   ├── panels/        # Dashboard panel components
│   ├── components/    # Shared medieval-themed UI components
│   ├── hooks/         # React hooks for MCP & settlement data
│   ├── theme/         # Medieval CSS & design tokens
│   └── types/         # TypeScript type definitions
├── mcp-server/        # MCP server with tools & resources
└── Start-ManorLordsDashboard.ps1
```

## Data Sources

- **Manual Entry** - Input settlement data directly
- **Save File Import** - JSON-format save data parsing (MVP)
- **Future: Memory Reading** - Direct game memory access (post-MVP)

## License

MIT
