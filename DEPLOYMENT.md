# Eventhour Deployment Guide

## CapRover Deployment

### Prerequisites

1. CapRover instance running
2. PostgreSQL database
3. Supabase project for authentication

### Environment Variables

Set these in CapRover App Config:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/eventhour

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Payment
PAYMENT_MODE=debug

# App
NEXT_PUBLIC_APP_URL=https://your-app.domain.com
NEXTAUTH_SECRET=generate-a-secure-secret
```

### Deployment Steps

1. **Connect GitHub Repository**
   - In CapRover, create new app
   - Enable "Has Persistent Data" if using file uploads
   - Connect to GitHub repository

2. **Configure Build**
   - CapRover will use `captain-definition` file
   - Docker build uses multi-stage build for optimization

3. **Database Setup**

   ```bash
   # Run migrations after first deployment
   npm run db:push
   npm run db:seed # For initial data
   ```

4. **SSL Configuration**
   - Enable HTTPS in CapRover
   - Force HTTPS redirect

## Local Development

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Direct Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

## Multiple Apps

The monorepo contains 3 apps:

- **web** (Port 3000): Main customer portal
- **admin** (Port 3001): Admin dashboard
- **partner** (Port 3002): Partner portal

For deploying multiple apps on CapRover:

1. Create separate CapRover apps for each
2. Modify Dockerfile CMD for each app:
   - Web: `CMD ["node", "apps/web/server.js"]`
   - Admin: `CMD ["node", "apps/admin/server.js"]`
   - Partner: `CMD ["node", "apps/partner/server.js"]`

## Troubleshooting

### Build Failures

- Check Node.js version (requires 18+)
- Verify all environment variables are set
- Check Prisma schema is valid

### Runtime Errors

- Verify database connection
- Check Supabase credentials
- Review application logs in CapRover

### Performance

- Enable caching in CapRover
- Use CDN for static assets
- Configure proper memory limits
