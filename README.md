# Practice Database Project - Log Analytics

A web access log analytics project focused on database performance optimization and benchmarking.

## Project Structure

- `be_db/` - Laravel Backend API
- `fe_db/` - React TypeScript Frontend

## Project Goals

- Process and analyze large-scale log data (1M-10M records)
- Optimize performance through 5 stages:
  1. Baseline (no optimization)
  2. Database indexing
  3. Redis caching
  4. Table partitioning
  5. Pre-aggregation
- Benchmark and compare performance improvements
- Dashboard to display optimization results

## Technology Stack

- **Backend**: Laravel 11, PHP 8.x, MySQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Caching**: Redis
- **Database**: MySQL

## Installation

### Backend (Laravel)
```bash
cd be_db
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend (React)
```bash
cd fe_db
npm install
npm run dev
```

## Development Roadmap

- [x] Database schema design
- [x] Complete project structure setup
- [ ] Generate seed data (1M+ records)
- [ ] Basic log analysis APIs
- [ ] Benchmark system implementation
- [ ] Step-by-step performance optimization
- [ ] Dashboard with comparison charts

## Features

### Analytics Capabilities
- **Top URLs Analysis** - Most accessed endpoints and their performance
- **Top IP Addresses** - Most active client IPs 
- **HTTP Status Distribution** - Response code analytics
- **Traffic Patterns** - Request volume by time periods
- **Response Time Analysis** - Performance metrics over time

### Performance Optimization Stages
1. **Baseline** - Initial queries without optimization
2. **Indexing** - Database indexes for common query patterns
3. **Caching** - Redis caching layer implementation
4. **Partitioning** - Table partitioning for large datasets
5. **Pre-aggregation** - Pre-computed summary tables

### Benchmark System
- Automated performance measurement
- Before/after comparison charts
- Export benchmark results to CSV
- Memory and CPU usage tracking
- Query execution time analysis

## Expected Outcomes

- **Performance Improvement**: Target ≥80% query time reduction
- **Scalability**: Handle 10M+ log records efficiently
- **Real Metrics**: Concrete evidence of optimization effectiveness
- **Learning**: Understanding when to apply different optimization techniques
