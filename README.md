# Azota Backend – Hệ Thống Thi Trắc Nghiệm Trực Tuyến

## 📌 Tổng quan dự án

**Azota Backend** là hệ thống máy chủ (Server-side) của website thi trắc nghiệm Azota, được xây dựng bằng **NestJS** theo mô hình **Modular Architecture** và **RESTful API**. Backend đóng vai trò trung tâm trong việc xử lý logic nghiệp vụ, xác thực người dùng, quản lý đề thi, bài làm, kết quả thi và phân quyền người dùng.

Dự án được thiết kế để phục vụ:

- Sinh viên / học sinh làm bài thi online
- Giáo viên tạo đề thi, quản lý câu hỏi
- Admin quản lý hệ thống

Backend giao tiếp trực tiếp với **Azota Frontend (Next.js)** thông qua API.

---

## 🎯 Mục tiêu hệ thống

- Xây dựng hệ thống thi trắc nghiệm **ổn định – mở rộng được – bảo mật**
- Áp dụng **JWT Authentication** và phân quyền rõ ràng
- Thiết kế code theo chuẩn **Clean Code & SOLID**
- Dễ dàng deploy lên **VPS / Docker / cPanel**

---

## 🚀 Công nghệ & Thư viện sử dụng

### Core

- **NestJS** – Node.js Framework
- **TypeScript** – Ngôn ngữ chính
- **Node.js** >= 18

### Authentication & Security

- **JWT (JSON Web Token)**
- **PassportJS** (JWT Strategy)
- **bcrypt** – mã hoá mật khẩu

### Database & ORM

- **PostgreSQL / MySQL** _(tuỳ cấu hình)_
- **TypeORM / Prisma** _(tuỳ cấu hình hiện tại của project)_

### Validation & Config

- **class-validator**
- **class-transformer**
- **@nestjs/config** (.env)

### Documentation & Dev Tools

- **Swagger (OpenAPI)**
- **ESLint**
- **Prettier**

---

## 🧱 Kiến trúc hệ thống

Backend được xây dựng theo mô hình **Module-based Architecture** của NestJS:

```
Controller  →  Service  →  Repository  →  Database
     ↑             ↓
   Guard         DTO / Entity
```

### Nguyên tắc áp dụng

- Controller: chỉ xử lý request / response
- Service: xử lý logic nghiệp vụ
- DTO: validate & transform dữ liệu
- Guard: bảo vệ route, phân quyền
- Entity/Model: ánh xạ database

### Cơ sở dữ liệu
<img width="1207" height="937" alt="image" src="https://github.com/user-attachments/assets/9e9ce152-ea17-411b-9e3a-d9f3ff730075" />

### Phân quyền
<img width="1005" height="532" alt="image" src="https://github.com/user-attachments/assets/1d2f6546-bfe3-4a9a-b3e9-3fc935355d02" />

---

## 📂 Cấu trúc thư mục chi tiết

```bash
azota-backend/
├── src/
│   ├── auth/                 # Xác thực & phân quyền
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   ├── users/                # Quản lý người dùng
│   ├── exams/                # Đề thi
│   ├── questions/            # Câu hỏi
│   ├── submissions/          # Bài làm
│   ├── results/              # Kết quả thi
│   ├── common/               # Guard, decorator, filter dùng chung
│   ├── config/               # Cấu hình hệ thống
│   ├── app.module.ts
│   └── main.ts
├── .env
├── package.json
├── nest-cli.json
└── README.md
```

---

## 🔐 Authentication & Authorization

### Cơ chế xác thực

- Người dùng đăng nhập → server trả về **JWT Access Token**
- Token được gửi kèm trong header của mỗi request

```http
Authorization: Bearer <access_token>
```

### Phân quyền (Role-based)

- **Admin**: quản lý toàn hệ thống
- **Teacher**: tạo đề thi, câu hỏi
- **Student**: làm bài thi, xem kết quả

Phân quyền được kiểm soát bằng:

- `JwtAuthGuard`
- `RolesGuard` (custom)

---

## 📝 Quản lý đề thi & bài làm

### Luồng làm bài thi

1. Student đăng nhập
2. Gọi API lấy đề thi
3. Làm bài & nộp bài
4. Backend chấm điểm
5. Lưu kết quả & trả về frontend

### Chức năng chính

- Tạo đề thi
- Thêm câu hỏi trắc nghiệm
- Nộp bài thi
- Tính điểm tự động
- Lưu lịch sử thi

---

## 📘 API Documentation (Swagger)

Sau khi chạy project:

👉 **[http://localhost:3001/api](http://localhost:3001/api)**

Swagger hỗ trợ:

- Xem toàn bộ API
- Test API trực tiếp
- Xem schema DTO
- Kiểm tra Authorization

---

## ⚙️ Cài đặt & Chạy project

### 1️⃣ Clone repository

```bash
git clone https://github.com/nam-Space/azota-backend.git
cd azota-backend
```

---

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

Nếu gặp lỗi dependency:

```bash
npm install --legacy-peer-deps
```

---

### 3️⃣ Cấu hình môi trường (.env)

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=azota_db

JWT_SECRET=azota_secret_key
JWT_EXPIRES_IN=7d
```

---

### 4️⃣ Chạy development

```bash
npm run start:dev
```

Server chạy tại:
👉 [http://localhost:3001](http://localhost:3001)

---

## 🌐 Kết nối Frontend

Frontend repository:
👉 [https://github.com/nam-Space/azota-frontend](https://github.com/nam-Space/azota-frontend)

Cấu hình CORS:

```ts
app.enableCors({
  origin: '*',
  credentials: true,
});
```

---

## 🧪 Scripts

```bash
npm run start:dev   # Chạy dev
npm run build       # Build production
npm run start:prod  # Chạy production
npm run lint        # Kiểm tra code
```

---

## 🚀 Build & Deploy

### Production

```bash
npm run build
npm run start:prod
```

### Hình thức deploy

- VPS + PM2
- Docker
- cPanel NodeJS App

---

## 🔮 Hướng phát triển tương lai

- Random đề thi
- Giới hạn thời gian làm bài
- Thống kê & biểu đồ điểm
- Export kết quả (Excel / PDF)
- WebSocket realtime

---

## 👨‍💻 Tác giả

- **Nam Nguyen**
- GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 📄 License

Dự án phục vụ mục đích **học tập, nghiên cứu và phát triển hệ thống thi trắc nghiệm trực tuyến**.
