# Raqim AI 966 - AI Prompt Generator

## Overview
Raqim AI 966 is a full-stack web application for generating, analyzing, and managing AI prompts. Built with React, TypeScript, Express, and PostgreSQL.

**Live URL**: Check the Webview panel to see the application running.

## Project Architecture

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Routing**: Wouter
- **State Management**: TanStack Query + tRPC
- **Build Tool**: Vite 7
- **Features**:
  - Bilingual support (Arabic/English) with RTL
  - Dark/Light theme
  - Prompt generation and analysis
  - Educational worksheet generator
  - User library management

### Backend
- **Runtime**: Node.js with Express
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL (Replit managed)
- **ORM**: Drizzle ORM
- **Port**: 5000 (frontend and backend on same server)

### Database Schema
- `users` - User authentication and profiles
- `savedPrompts` - User's saved prompts
- `popularPrompts` - Community shared prompts
- `promptRatings` - Ratings for popular prompts
- `activityLog` - User activity tracking
- `worksheets` - Generated educational worksheets
- `templateRatings` - Template ratings
- `templateUsage` - Template usage statistics

## Recent Changes (November 24, 2025)

### GitHub Import Setup
- Converted database schema from MySQL to PostgreSQL
- Updated Drizzle ORM configuration for PostgreSQL
- Configured Vite to allow all hosts for Replit proxy compatibility
- Set server to run on port 5000 with host 0.0.0.0
- Installed `postgres` package for database connectivity
- Generated and applied PostgreSQL migrations
- Removed missing wouter patch reference from package.json
- Configured deployment for autoscale

## Environment Variables

### Currently Set
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `PORT` - Server port (5000)
- `NODE_ENV` - Environment mode (development)

### Optional Variables
These are referenced in the code but not required for basic functionality:
- `JWT_SECRET` - For session management
- `LLM_API_KEY` - For AI prompt generation (Gemini/OpenAI)
- `LLM_API_URL` - LLM API endpoint
- `GEMINI_MODEL` - Model name for Gemini
- `VITE_APP_TITLE` - Custom app title
- `VITE_APP_LOGO` - Custom logo path
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID
- `OAUTH_SERVER_URL` - OAuth server URL
- `OWNER_OPEN_ID` - Admin user identifier

## Development

### Running the Application
The application is already running via the "Start application" workflow.
- Command: `pnpm dev`
- Port: 5000
- The development server uses Vite for hot module replacement

### Database Operations
```bash
# Generate migrations after schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Push schema changes (alternative)
pnpm db:push
```

### Building for Production
```bash
pnpm build
```

## Deployment
Configured for Replit Autoscale deployment:
- Build: `pnpm build`
- Run: `node dist/index.js`
- The build compiles both frontend (Vite) and backend (esbuild)

## Known Issues & Notes

1. **Analytics Warnings**: The app references analytics environment variables that are optional. These warnings can be ignored or the variables can be set if analytics are needed.

2. **Peer Dependency Warnings**: 
   - `react-joyride` expects React 15-18 but we're using React 19
   - `openai` expects zod 3.x but we're using zod 4.x
   - These are non-critical and don't affect functionality

3. **Database**: Converted from MySQL to PostgreSQL - all core functionality works with the new schema.

4. **Disabled Features** (from Manus platform migration):
   - Voice transcription (relied on Manus Forge API)
   - Image generation (relied on Manus ImageService)
   - Data API calls (relied on Manus Forge API)
   - Storage functionality (relied on Manus Forge API)

## User Preferences
None documented yet.

## Project Structure
```
raqim_ai_966/
├── client/               # Frontend React application
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Application pages
│       ├── hooks/       # Custom React hooks
│       ├── contexts/    # React contexts
│       ├── lib/         # Utility libraries
│       └── locales/     # i18n translations
├── server/              # Backend Express server
│   ├── _core/          # Core server functionality
│   ├── db.ts           # Database operations
│   ├── routers.ts      # tRPC routers
│   └── storage.ts      # File storage
├── drizzle/            # Database schema & migrations
├── shared/             # Shared code between client/server
└── dist/               # Build output
```

## Tech Stack
- React 19 + TypeScript
- Express + tRPC
- PostgreSQL + Drizzle ORM
- Vite + Tailwind CSS 4
- shadcn/ui components
- i18next for internationalization
