# Deployment Guide

This guide explains how to deploy the Tiptap UI Kit demo to various platforms.

## 📦 Vercel (Recommended)

Vercel provides the easiest deployment experience for Vite projects.

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the framework (Vite)
5. Click "Deploy"

### Configuration

The project includes a `vercel.json` configuration file:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 🚀 Netlify

Deploy to Netlify with these steps:

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### netlify.toml Configuration

Create a `netlify.toml` file:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🌐 GitHub Pages

Deploy the demo to GitHub Pages:

### Setup

1. Install `gh-pages` package:

```bash
pnpm add -D gh-pages
```

2. Add deployment script to `package.json`:

```json
{
  "scripts": {
    "deploy:gh-pages": "pnpm build && gh-pages -d dist"
  }
}
```

3. Run deployment:

```bash
pnpm run deploy:gh-pages
```

4. Configure GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / root
   - Click Save

Your site will be available at: `https://YOUR_USERNAME.github.io/Tiptap-UI-Kit/`

## 🐳 Docker

Deploy using Docker:

### Dockerfile

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and Run

```bash
# Build image
docker build -t tiptap-ui-kit .

# Run container
docker run -p 8080:80 tiptap-ui-kit
```

Visit http://localhost:8080

## ☁️ AWS S3 + CloudFront

Deploy to AWS S3 with CloudFront CDN:

### Prerequisites

- AWS CLI installed and configured
- An S3 bucket created
- CloudFront distribution created (optional)

### Deployment Steps

```bash
# Build the project
pnpm build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Automation

Add to `package.json`:

```json
{
  "scripts": {
    "deploy:aws": "pnpm build && aws s3 sync dist/ s3://your-bucket-name --delete"
  }
}
```

## 🔧 Environment Variables

If your demo uses environment variables (e.g., for AI features):

### Vercel

```bash
# Set via CLI
vercel env add VITE_AI_API_KEY

# Or add in Vercel Dashboard
# Project Settings → Environment Variables
```

### Netlify

```bash
# Set via CLI
netlify env:set VITE_AI_API_KEY your_key_here

# Or add in Netlify Dashboard
# Site Settings → Environment Variables
```

### Docker

```bash
# Pass at runtime
docker run -p 8080:80 \
  -e VITE_AI_API_KEY=your_key \
  tiptap-ui-kit
```

## 🔍 Verification

After deployment, verify:

1. ✅ Site loads correctly
2. ✅ All assets load (check Network tab)
3. ✅ Routing works (navigate to different pages)
4. ✅ Styles applied correctly
5. ✅ JavaScript executes without errors
6. ✅ Forms and interactions work
7. ✅ Mobile responsiveness
8. ✅ Performance (Lighthouse score)

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### 404 on Routes

Make sure your hosting platform has proper rewrite rules to serve `index.html` for all routes.

### Assets Not Loading

Check that `base` is set correctly in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // or '/your-app/' for subdirectory
})
```

### Environment Variables Not Working

- Prefix with `VITE_` for Vite to expose them
- Restart dev server after adding variables
- Check variable names match exactly

## 📊 Performance Optimization

### Before Deployment

```bash
# Analyze bundle size
pnpm build --mode production

# Check bundle
npx vite-bundle-visualizer
```

### Optimization Tips

1. **Enable gzip/brotli compression**
2. **Set proper cache headers**
3. **Use a CDN** (CloudFront, Cloudflare)
4. **Optimize images** before including
5. **Code split** large dependencies
6. **Lazy load** routes/components

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Guide](https://pages.github.com)

---

Need help? [Open an issue](https://github.com/benngaihk/Tiptap-UI-Kit/issues)
