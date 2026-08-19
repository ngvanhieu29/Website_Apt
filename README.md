# SaigonStay – Premium Apartment Rental for Expats

Website giới thiệu căn hộ cho thuê dành cho người nước ngoài tại TP.HCM.

**Stack:** React + Vite (Frontend) · Node.js + Express + MongoDB (Backend)

## Tính năng

- Danh sách căn hộ với đầy đủ thông tin: địa chỉ, giá/tháng, diện tích, số phòng ngủ, nhà vệ sinh, số người ở, tiện ích...
- Tìm kiếm theo từ khóa
- Lọc theo: quận, giá, số phòng ngủ, nhà vệ sinh, diện tích, số người ở, furnished, pet-friendly, near metro
- Sắp xếp theo giá / diện tích / mới nhất
- Trang chi tiết căn hộ
- Header & Footer thiết kế cao cấp
- Responsive (mobile + desktop)

## Cách chạy

### 1. Cài MongoDB
Cài MongoDB Community trên máy và chạy service (mặc định port 27017).

### 2. Backend

```bash
cd backend
npm install
npm run seed      # nạp dữ liệu mẫu (8 căn hộ)
npm run dev       # chạy server tại http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev       # chạy tại http://localhost:5173
```

Mở trình duyệt: **http://localhost:5173**

## Cấu trúc thư mục

```
apartment-rental/
├── backend/
│   ├── src/
│   │   ├── models/Apartment.js
│   │   ├── controllers/apartmentController.js
│   │   ├── routes/apartmentRoutes.js
│   │   ├── seed.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ (Header, Footer, ApartmentCard, FilterPanel)
    │   ├── pages/ (Home, ApartmentDetail)
    │   ├── api/
    │   └── ...
    └── package.json
```

## Ghi chú

- Thông tin liên hệ (phone, email) hiện đang để placeholder – bạn có thể thêm sau.
- Ảnh mẫu lấy từ Unsplash.
- API hỗ trợ query params đầy đủ để filter & search.
