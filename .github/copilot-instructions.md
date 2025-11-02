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
res.status(200).json(data)

// Error responses
res.status(500).json({ message: "Error description", error })
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
  onError: (error) => showToast(error)
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
- **Platform**: Vercel (inferred from Next.js setup)
- **Static Assets**: Served from `public/` directory
- **API Routes**: Serverless functions on Vercel

## File Structure Reference
- `components/dashboard/utils/`: CRUD handlers for portfolio/techstack
- `components/v2/`: Active UI components
- `data/`: JSON data files
- `pages/api/`: API route handlers
- `public/img/`: Uploaded images and assets</content>
<parameter name="filePath">/Users/mac/backup/Github/uki.my.id/.github/copilot-instructions.md