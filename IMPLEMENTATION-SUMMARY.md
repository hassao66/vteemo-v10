# خلاصه پیاده‌سازی - احراز هویت با پیامک و ایمیل ایرانی

## تغییرات انجام شده

### 1. سرویس‌های جدید

#### FarazSMS Service (`src/services/farazsms.service.ts`)
- ارسال کد OTP از طریق پیامک
- ارسال پیامک با الگو (Pattern)
- بررسی وضعیت ارسال پیامک
- پشتیبانی کامل از شماره‌های موبایل ایرانی (09xxxxxxxxx)

#### Email.ir Service (`src/services/emailir.service.ts`)
- ارسال ایمیل تایید با کد OTP
- ارسال ایمیل خوش‌آمدگویی
- ارسال ایمیل بازیابی رمز عبور
- قالب‌های HTML زیبا و کاملاً فارسی

#### Auth API Service (`src/services/auth-api.service.ts`)
- جایگزینی کامل Supabase با API سفارشی
- ورود با ایمیل/نام کاربری و رمز عبور
- ثبت‌نام با ایمیل
- ثبت‌نام با شماره موبایل و OTP
- مدیریت توکن‌های احراز هویت
- Refresh token

### 2. کامپوننت‌های جدید

#### Protected Route (`src/components/ProtectedRoute.tsx`)
- محافظت از مسیرها (Routes)
- بررسی احراز هویت کاربر
- Redirect خودکار به صفحه ورود
- پشتیبانی از مسیرهای ادمین (requireAdmin)
- نمایش Loading state

### 3. تغییرات در فایل‌های موجود

#### AuthContext.tsx
- ✅ حذف وابستگی به Supabase
- ✅ استفاده از API سفارشی برای احراز هویت
- ✅ پشتیبانی از ورود با نام کاربری یا ایمیل
- ✅ مدیریت بهتر خطاها
- ✅ حذف onAuthStateChange (دیگر نیازی به Supabase نیست)

#### App.tsx
- ✅ اضافه شدن ProtectedRoute به همه مسیرها
- ✅ محافظت از صفحات اصلی (Home, Upload, Profile, ...)
- ✅ محافظت از پنل ادمین با requireAdmin
- ✅ صفحات Login, Register و RegisterPhone بدون محافظت

#### RegisterPhone.tsx
- ✅ قبلاً API endpoints صحیح داشت
- ✅ از api.vteemo.com استفاده می‌کند
- ✅ ارسال و تایید OTP
- ✅ ثبت‌نام کامل با username و password

### 4. پیکربندی Nginx

#### nginx-site.conf
- ✅ تنظیمات کامل برای دامنه vteemo.com
- ✅ HTTP to HTTPS redirect
- ✅ پیکربندی SSL/TLS
- ✅ تنظیمات امنیتی (HSTS, CSP, XSS Protection)
- ✅ Proxy برای API backend
- ✅ فشرده‌سازی gzip
- ✅ Cache برای فایل‌های static
- ✅ پشتیبانی از آپلود فایل‌های بزرگ (500MB)

### 5. متغیرهای محیطی (.env.example)

```env
# App Configuration
VITE_APP_NAME=Vteemo
VITE_APP_URL=https://vteemo.com
VITE_API_URL=https://api.vteemo.com/api

# Iranian SMS Service (FarazSMS)
VITE_FARAZSMS_API_KEY=your_farazsms_api_key_here
VITE_FARAZSMS_BASE_URL=https://api.farazsms.com/v2
VITE_FARAZSMS_SENDER=1000000000

# Iranian Email Service (Email.ir)
VITE_EMAILIR_API_KEY=your_emailir_api_key_here
VITE_EMAILIR_BASE_URL=https://api.email.ir/v1
VITE_EMAILIR_FROM_EMAIL=noreply@vteemo.com
VITE_EMAILIR_FROM_NAME=ویتیمو
```

## ویژگی‌های پیاده‌سازی شده

### ✅ احراز هویت
- [x] ورود با ایمیل/نام کاربری و رمز عبور
- [x] ثبت‌نام با ایمیل
- [x] ثبت‌نام با شماره موبایل ایرانی + OTP
- [x] خروج از سیستم
- [x] دریافت اطلاعات کاربر جاری
- [x] Refresh token

### ✅ محافظت از مسیرها
- [x] تمام صفحات پشت لاگین قرار دارند
- [x] صفحات Login, Register, RegisterPhone عمومی هستند
- [x] پنل ادمین فقط برای ادمین‌ها
- [x] Redirect خودکار به صفحه login

### ✅ پیامک ایرانی (FarazSMS)
- [x] ارسال کد OTP
- [x] ارسال با Pattern
- [x] اعتبارسنجی شماره موبایل ایرانی
- [x] مدیریت خطاها

### ✅ ایمیل ایرانی (Email.ir)
- [x] ارسال ایمیل تایید
- [x] ارسال ایمیل خوش‌آمدگویی
- [x] ارسال ایمیل بازیابی رمز عبور
- [x] قالب‌های HTML زیبا و فارسی

### ✅ Nginx و SSL
- [x] پیکربندی برای vteemo.com
- [x] HTTP to HTTPS redirect
- [x] تنظیمات SSL
- [x] تنظیمات امنیتی
- [x] Proxy برای API

## معماری سیستم

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌───────────────────┐  ┌──────────────────┐  ┌───────────────┐│
│  │   Auth Context    │  │ Protected Routes │  │ Register Phone││
│  └────────┬──────────┘  └─────────┬────────┘  └───────┬───────┘│
│           │                       │                    │         │
│           └───────────────────────┴────────────────────┘         │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ HTTPS
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    Nginx (vteemo.com)                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  SSL/TLS Termination, Security Headers, Gzip, Cache        ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────┬───────────────────────────────────┘
                               │
                   ┌───────────┴──────────┐
                   │                      │
                   ▼                      ▼
        ┌──────────────────┐   ┌──────────────────┐
        │  Static Files    │   │  API Backend     │
        │  (React Build)   │   │  (Node.js/etc)   │
        └──────────────────┘   └────────┬─────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                        ▼                               ▼
              ┌──────────────────┐          ┌──────────────────┐
              │   FarazSMS API   │          │   Email.ir API   │
              │  (SMS Service)   │          │ (Email Service)  │
              └──────────────────┘          └──────────────────┘
```

## نیازمندی‌های Backend

برای کار کامل سیستم، نیاز به یک Backend API دارید که endpoint‌های زیر را پیاده‌سازی کند:

### Endpoints مورد نیاز:

```
POST /api/auth/register/phone/send-otp
  Body: { phone: string }
  Response: { success: boolean, message: string }

POST /api/auth/register/verify
  Body: { type: 'phone', phone: string, otp: string, username: string, password: string }
  Response: { success: boolean, data: { user: User, token: string } }

POST /api/auth/login
  Body: { identifier: string, password: string }
  Response: { success: boolean, data: { user: User, token: string } }

POST /api/auth/register
  Body: { email: string, username: string, password: string }
  Response: { success: boolean, data: { user: User, token: string } }

GET /api/auth/me
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean, data: { user: User } }

POST /api/auth/logout
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

POST /api/auth/refresh
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean, data: { token: string } }
```

## راهنماهای نصب

### 1. راه‌اندازی Frontend

```bash
# نصب وابستگی‌ها
npm install

# تنظیم متغیرهای محیطی
cp .env.example .env
# ویرایش .env و تنظیم مقادیر

# توسعه
npm run dev

# ساخت برای Production
npm run build
```

### 2. راه‌اندازی Nginx و SSL

مراجعه کنید به: [NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md)

### 3. راه‌اندازی سرویس‌های ایرانی

مراجعه کنید به: [IRANIAN-SERVICES-SETUP.md](./IRANIAN-SERVICES-SETUP.md)

## تست‌ها

### تست مسیرهای محافظت شده

1. بدون لاگین به `/` بروید → باید به `/login` redirect شود
2. بدون لاگین به `/upload` بروید → باید به `/login` redirect شود
3. بعد از لاگین به `/` بروید → باید صفحه اصلی نمایش داده شود

### تست ثبت‌نام با موبایل

1. به `/register/phone` بروید
2. شماره موبایل ایرانی وارد کنید (09xxxxxxxxx)
3. کد OTP دریافت شود
4. کد را وارد کنید
5. نام کاربری و رمز عبور تنظیم کنید
6. باید به صفحه اصلی redirect شود

### تست ورود

1. به `/login` بروید
2. ایمیل/نام کاربری و رمز عبور وارد کنید
3. باید به صفحه اصلی (یا صفحه قبلی) redirect شود

## نکات مهم

### امنیت

1. **API Keys**: هرگز API Key را در frontend قرار ندهید
2. **Rate Limiting**: در backend محدودیت تعداد درخواست اعمال کنید
3. **OTP Expiry**: کد OTP باید حداکثر 5 دقیقه معتبر باشد
4. **HTTPS**: همیشه از HTTPS استفاده کنید
5. **CORS**: CORS را به درستی پیکربندی کنید

### عملکرد

1. **Token Storage**: توکن در localStorage ذخیره می‌شود
2. **Auto Refresh**: برای Auto-refresh token از interceptor استفاده کنید
3. **Loading State**: در تمام درخواست‌ها loading state نمایش داده شود
4. **Error Handling**: خطاها به صورت مناسب مدیریت شوند

### تجربه کاربری

1. **Responsive**: سایت کاملاً responsive است
2. **Dark Mode**: پشتیبانی از حالت تاریک
3. **RTL**: پشتیبانی کامل از راست‌چین
4. **فارسی**: تمام متن‌ها و پیام‌ها به فارسی

## مشکلات احتمالی و راه‌حل

### مشکل: Build شکست می‌خورد
**راه‌حل**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### مشکل: CORS Error
**راه‌حل**: در backend CORS را برای vteemo.com فعال کنید
```javascript
app.use(cors({
  origin: 'https://vteemo.com',
  credentials: true
}));
```

### مشکل: Token منقضی می‌شود
**راه‌حل**: از refresh token استفاده کنید یا مدت اعتبار token را افزایش دهید

### مشکل: پیامک ارسال نمی‌شود
**راه‌حل**: 
1. بررسی API Key
2. بررسی اعتبار حساب
3. بررسی لاگ‌ها در پنل FarazSMS

### مشکل: SSL Certificate Error
**راه‌حل**: 
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## منابع

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [FarazSMS API](https://farazsms.com/documentation)
- [Email.ir API](https://email.ir/documentation)

## تماس و پشتیبانی

- Website: https://vteemo.com
- Email: support@vteemo.com
- Server IP: 185.126.203.170
