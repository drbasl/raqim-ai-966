# Raqim AI 966 - AI Prompt Generator

## Overview
Raqim AI 966 is a comprehensive web application that helps users generate, analyze, and manage AI prompts in both Arabic and English. The platform provides professional prompt generation, analysis tools, worksheet creation, and a prompt library system.

## Project Structure
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Backend**: Node.js + Express + tRPC
- **Database**: PostgreSQL (via Replit)
- **Package Manager**: pnpm

## Recent Changes (November 24, 2025)
- Migrated from MySQL to PostgreSQL for Replit compatibility
- Converted all database schemas from MySQL to PostgreSQL
- Updated Drizzle ORM configuration for PostgreSQL
- Configured server to run on port 5000 with host 0.0.0.0
- Set up Vite with proper host configuration for Replit proxy
- Integrated DeepSeek LLM API for AI prompt generation
- Removed missing wouter patch dependency

## Environment Variables
### Required
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- `LLM_API_URL` - DeepSeek API endpoint
- `LLM_API_KEY` - DeepSeek API key
- `DEEPSEEK_MODEL` - Model name (deepseek-chat)
- `PORT` - Server port (5000)
- `NODE_ENV` - Environment mode (development/production)

### Optional
- `JWT_SECRET` - For authentication (auto-generated)
- `VITE_APP_LOGO` - Custom logo path
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID
- `OAUTH_SERVER_URL` - OAuth server URL
- `OWNER_OPEN_ID` - Admin user identifier

## Key Features
1. **Prompt Generator** - AI-powered prompt generation with customization
2. **Prompt Analyzer** - Quality assessment and improvement suggestions
3. **Worksheet Generator** - Educational worksheet creation
4. **Prompt Library** - Save, organize, and share prompts
5. **Bilingual Support** - Full Arabic and English interface
6. **Dark/Light Mode** - Theme switching support

## Development
```bash
pnpm install    # Install dependencies
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
```

## Database
- Using PostgreSQL via Replit's built-in database
- Migrations managed with Drizzle Kit
- Run `pnpm db:push` to generate and apply migrations

## Deployment
- Configured for Replit autoscale deployment
- Build command: `pnpm build`
- Run command: `node dist/index.js`
- Frontend served on port 5000

## Architecture Notes
- Server runs on 0.0.0.0:5000 for Replit compatibility
- Vite dev server configured with `allowedHosts: true`
- Database connection uses lazy initialization for tooling compatibility
- Some Manus-specific features disabled (Data API, Voice Transcription, Storage, Image Generation)
