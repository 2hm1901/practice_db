# Practice Database Project - Log Analytics

Dự án phân tích log truy cập web với focus vào tối ưu hiệu năng database và benchmark.

## Cấu trúc dự án

- `be_db/` - Laravel Backend API
- `fe_db/` - React TypeScript Frontend

## Mục tiêu dự án

- Xử lý và phân tích log với khối lượng lớn (1M-10M bản ghi)
- Tối ưu hiệu năng qua 5 giai đoạn:
  1. Baseline (chưa tối ưu)
  2. Database indexing
  3. Redis caching
  4. Table partitioning
  5. Pre-aggregation
- Benchmark và so sánh hiệu năng
- Dashboard hiển thị kết quả tối ưu

## Technology Stack

- **Backend**: Laravel 11, PHP 8.x, MySQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Caching**: Redis
- **Database**: MySQL

## Cài đặt

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

## Giai đoạn phát triển

- [ ] Thiết kế database schema
- [ ] Tạo seeder dữ liệu giả lập
- [ ] API phân tích log cơ bản
- [ ] Benchmark system
- [ ] Tối ưu hiệu năng từng giai đoạn
- [ ] Dashboard hiển thị kết quả
