# 🚀 OAuth Hub - Oracle Database Setup Guide

## Prerequisites

1. **Oracle Database** (Autonomous Database recommended)
2. **Node.js 18+** installed
3. **Oracle Instant Client** (optional, for local development)

## 📋 Environment Variables Required

Create a `.env` file in the project root with these variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Oracle Database Configuration
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECT_STRING=your_oracle_connection_string

# Database Pool Configuration (optional)
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=1
DB_POOL_TIMEOUT=60
DB_QUEUE_TIMEOUT=60000

# Oracle Client Library Path (if needed)
# ORACLE_CLIENT_LIB_DIR=/usr/lib/oracle/21/client64/lib

# JWT Secret for session encryption
JWT_SECRET=your_super_secret_jwt_key_here
```

## 🗄️ Database Setup

### Option 1: Oracle Autonomous Database (Recommended)

1. Create an Oracle Autonomous Database in OCI
2. Get your connection string from the database details
3. Use the TLS connection string for production

### Option 2: Oracle Database on OCI

1. Create a VM with Oracle Database
2. Configure network security groups
3. Use the standard connection string

## 🔧 Installation

```bash
# Install dependencies (includes Oracle driver)
npm install

# For Oracle Instant Client (optional):
# Download and install Oracle Instant Client
# Set ORACLE_CLIENT_LIB_DIR in .env if needed
```

## 📊 Database Schema

Run the SQL script to create tables:

```sql
-- Connect to your Oracle database and run:
-- File: src/schema.sql
```

## 🚀 Deployment

```bash
# Start the application
npm start

# Or for development:
npm run dev
```

## 🔍 Health Check

After starting, check the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-28T...",
  "database": "connected",
  "dbConnection": "healthy",
  "version": "2.0.0-oracle"
}
```

## 🔐 Security Notes

- **Never commit** `.env` files to version control
- Use **strong passwords** for database credentials
- Enable **TLS encryption** for production connections
- Regularly **rotate JWT secrets**
- **Monitor** database connection pool usage

## 🐛 Troubleshooting

### Database Connection Issues

1. **Verify credentials** in `.env`
2. **Check network connectivity** to Oracle database
3. **Ensure TLS certificates** are properly configured
4. **Test connection** using SQL*Plus or SQL Developer

### Oracle Instant Client Issues

```bash
# Install Oracle Instant Client:
# 1. Download from Oracle website
# 2. Extract to /usr/lib/oracle/
# 3. Set LD_LIBRARY_PATH or use ORACLE_CLIENT_LIB_DIR
```

### Connection Pool Issues

- Monitor pool usage in application logs
- Adjust pool settings based on load
- Ensure proper connection cleanup

## 📈 Performance Tuning

### Database Pool Configuration

```bash
# For high-traffic applications:
DB_POOL_MIN=5
DB_POOL_MAX=50
DB_POOL_INCREMENT=2

# For low-traffic applications:
DB_POOL_MIN=1
DB_POOL_MAX=5
DB_POOL_INCREMENT=1
```

### Monitoring

- Use Oracle Enterprise Manager for database monitoring
- Monitor application logs for connection pool status
- Set up alerts for connection failures

## 🔄 Migration from Cloudflare KV

If migrating from Cloudflare KV:

1. **Export data** from Cloudflare (if needed)
2. **Run database schema** creation
3. **Update environment variables**
4. **Test authentication flows**
5. **Monitor for issues**

The application will automatically handle the transition from in-memory to Oracle database storage.

---

**Need help?** Check the application logs and Oracle database logs for detailed error messages.
