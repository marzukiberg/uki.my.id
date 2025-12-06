# AI Coding Assistant Instructions for uki.my.id

## Project Overview

This is a Next.js portfolio website with an admin dashboard. The site showcases frontend development work with a clean, modern design using Tailwind CSS and shadcn/ui components.

## Architecture & Key Components

### Version Structure

- **Active Version**: `pages/v2/` (main index redirects here)
- **Legacy Version**: Commented out in `pages/index.js`
- **Admin Dashboard**: `pages/dashboard.js` with tabbed interface

### Data Layer

- **Storage**: JSON files in `/data/` directory (`portfolio.json`, `techstack.json`)
- **API Pattern**: RESTful endpoints in `pages/api/` that read/write JSON directly
- **Example**: `pages/api/portfolio.js` uses `fs/promises` for file operations

### Authentication

- **Method**: Secret-based auth via `AUTH_SECRET_KEY` environment variable
- **Implementation**: `pages/api/auth/secret.js` sets httpOnly cookies
- **Middleware**: `middleware.js` protects `/dashboard` route

## Development Workflow

### Package Management

```bash
pnpm install  # Never use npm/yarn
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # ESLint check
```

### Git Workflow

```bash
git status                    # Check current changes
git add <files>              # Stage specific files
git add .                    # Stage all changes
git commit -m "message"      # Commit with descriptive message
git push origin main         # Push to main branch
```

**Commit Message Guidelines:**

- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 50 characters
- Add detailed description for complex changes
- Reference issues: "Fix #123: resolve timeout issue"

### File Uploads

- **Library**: `formidable` for multipart form handling
- **Storage**: `public/uploads/` and `public/img/logos/`
- **Naming**: UUID-based filenames (`uuidv4()`)
- **Limits**: 10MB max file size

## Component Patterns

### UI Components

- **Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties
- **Icons**: Always use Lucide React icons instead of manual SVG elements
- **Path Aliases**: `@/components/*` and `@/lib/*` configured in `tsconfig.json`

### Component Organization

```
components/
├── organisms/     # Page-level components (Hero, About, Footer)
├── atoms/         # Reusable UI atoms
├── dashboard/     # Admin interface components
├── ui/            # shadcn/ui components
└── v2/            # Current version components
```

### Data Flow

- **Portfolio Data**: `data/portfolio.json` → `pages/api/portfolio.js` → Components
- **Tech Stack**: `data/techstack.json` → `pages/api/techstack.js` → Components
- **State Management**: Local React state, no global state library

## Key Conventions

### Image Handling

- **External Images**: Cloudinary URLs (whitelisted in `next.config.js`)
- **Local Uploads**: Store in `public/` directory, reference with `/` prefix
- **Domains**: `res.cloudinary.com`, `placehold.co` allowed

### API Response Format

```javascript
// Success responses
res.status(200).json(data);

// Error responses
res.status(500).json({ message: "Error description", error });
```

### Form Handling

- **Library**: Formik with Yup validation
- **File Uploads**: `react-dropzone` for drag-and-drop interface
- **Validation**: Client-side with Yup schemas

### Routing

- **Pages Router**: Traditional Next.js routing
- **Dynamic Routes**: None currently implemented
- **API Routes**: `/api/*` mapped to `pages/api/*`

## Common Patterns

### Dashboard CRUD Operations

```javascript
// Pattern in dashboard components
const handlers = createPortfolioHandlers({
  onSuccess: () => refreshData(),
  onError: (error) => showToast(error),
});
```

### Component Props

- **Router**: Pass `router` prop for navigation (Next.js useRouter)
- **State**: Local state with `useState` for form data
- **Callbacks**: Function props for parent communication

### Error Handling

- **API Errors**: Try/catch blocks with user-friendly messages
- **Validation**: Formik+Yup for client-side validation
- **File Operations**: Async/await with proper error responses

## Environment Variables

- `AUTH_SECRET_KEY`: Secret for dashboard authentication
- `NODE_ENV`: Development/production detection

## Build Configuration

- **TypeScript**: Loose mode (`strict: false`) with path mapping
- **Tailwind**: Custom design tokens with CSS variables
- **PostCSS**: Standard configuration
- **ESLint**: Next.js default rules

## Deployment Notes

### Target Server

- **Server**: stb-local (ARM64-based server)
- **Containerization**: Docker with Node.js 18 Alpine image
- **Port**: 3000 (proxied by cloudflared)
- **Domain**: ukay.dev (via cloudflared tunnel)

### PM2 Deployment Process

#### 1. Prerequisites

- SSH access to stb-server
- PM2 installed on server
- Node.js and pnpm installed
- Cloudflared tunnel configured

#### 2. Build and Deploy Steps

```bash
# 1. Build locally
pnpm build

# 2. Create archive of build artifacts
tar -cJf build-artifacts.tar.xz .next public package.json next.config.js

# 3. Copy to server
scp build-artifacts.tar.xz stb-server:/mnt/sdcard/stb/docker/ukay.dev/

# 4. Extract and restart on server
ssh stb-server "cd /mnt/sdcard/stb/docker/ukay.dev && \
    tar -xJf build-artifacts.tar.xz && \
    pm2 restart ukay.dev"
```

#### 3. Environment Variables

- `AUTH_SECRET_KEY`: Required for dashboard authentication
- `NODE_ENV`: Set to 'production' for production builds

#### 4. PM2 Configuration

- **Process Name**: ukay.dev
- **Start Command**: `pm2 start npm --name 'ukay.dev' -- start`
- **Auto-restart**: Enabled via `pm2 save`

#### 5. Cloudflared Configuration

Ensure `/etc/cloudflared/config.yml` includes:

```yaml
ingress:
  - hostname: ukay.dev
    service: http://localhost:3000
```

#### 6. Troubleshooting

- **Port conflicts**: Check if other services are using port 3000
- **PM2 issues**: Use `pm2 logs ukay.dev` to check logs
- **Permission issues**: Ensure proper file permissions
- **Build failures**: Check Node.js and pnpm versions

### Legacy Deployment (Docker)

- **Previous method**: Docker containerization
- **Location**: `/mnt/sdcard/stb/docker/ukay.dev/`
- **Status**: Deprecated, replaced by PM2

## File Structure Reference

- `components/dashboard/utils/`: CRUD handlers for portfolio/techstack
- `components/v2/`: Active UI components
- `data/`: JSON data files
- `pages/api/`: API route handlers
- `public/img/`: Uploaded images and assets
- `scripts/`: Python utilities (TikTok, Instagram downloaders)
- `Dockerfile`: Docker build configuration
- `docker-compose.yml`: Docker Compose configuration</content>
  <parameter name="filePath">/Users/mac/backup/Github/uki.my.id/.github/copilot-instructions.md
