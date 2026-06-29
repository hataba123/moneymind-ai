# MoneyMind AI

MoneyMind AI là web app quản lý thu chi cá nhân dùng Next.js App Router. Ứng dụng hỗ trợ đăng nhập Google, dashboard thống kê, quản lý giao dịch, ngân sách theo tháng và trợ lý AI phân tích tài chính cá nhân.

## Tech stack

- Next.js App Router, TypeScript, Tailwind CSS
- Auth.js / NextAuth Google Login
- MongoDB Atlas, Mongoose
- DeepSeek API, fallback rule-based khi chưa có key
- Recharts
- Zod
- ESLint

## Tính năng

- Landing page responsive và dashboard layout có sidebar.
- Google sign in/sign out, protected dashboard routes.
- CRUD giao dịch thu/chi, filter theo loại, danh mục, ngày và search ghi chú.
- Dashboard: tổng thu, tổng chi, số dư, tỷ lệ tiết kiệm, top danh mục, giao dịch gần đây, biểu đồ Recharts.
- Budget tracking theo danh mục/tháng, cảnh báo 80% và 100%.
- AI Assistant đọc dữ liệu user hiện tại, lưu lịch sử tư vấn, fallback rule-based nếu thiếu `DEEPSEEK_API_KEY`.
- Gợi ý category thông minh từ note bằng DeepSeek hoặc rule-based mapping.
- Settings quản lý danh mục custom, không xóa danh mục mặc định.
- Demo data cho user đang đăng nhập để test dashboard và AI.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu hình môi trường

Tạo `.env.local` dựa trên `.env.example`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

Nếu chưa cấu hình `MONGODB_URI`, app dùng in-memory demo store cho phiên chạy local. Khi có MongoDB Atlas, dữ liệu được lưu bằng Mongoose.

## MongoDB Atlas

1. Tạo cluster MongoDB Atlas.
2. Tạo database user và allow IP phù hợp.
3. Copy connection string vào `MONGODB_URI`.
4. Chạy lại `npm run dev`.

## Google Login

1. Tạo OAuth Client trong Google Cloud Console.
2. Authorized redirect URI local: `http://localhost:3000/api/auth/callback/google`.
3. Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
4. Tạo `NEXTAUTH_SECRET` bằng secret đủ mạnh.

## DeepSeek API

Điền `DEEPSEEK_API_KEY` để bật phân tích AI và gợi ý category bằng DeepSeek. Mặc định app dùng `DEEPSEEK_MODEL=deepseek-v4-flash` và `DEEPSEEK_BASE_URL=https://api.deepseek.com`. Nếu bỏ trống key, app tự dùng phân tích rule-based.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Roadmap

- Thêm báo cáo theo quý/năm.
- Export Excel/PDF.
- Budget recurring tự động.
- Import giao dịch từ file ngân hàng.
- Cảnh báo realtime qua email hoặc notification.
