# راهنمای سریع - vteemo.com

## خلاصه تغییرات

این پروژه برای استفاده از سرویس‌های ایرانی و محافظت کامل از صفحات بروزرسانی شده است.

### ✅ ویژگی‌های پیاده‌سازی شده

1. **احراز هویت با پیامک ایرانی (FarazSMS)**
   - ثبت‌نام با شماره موبایل
   - ارسال کد OTP
   - تایید کد و فعال‌سازی حساب

2. **احراز هویت با ایمیل ایرانی (Email.ir)**
   - ارسال ایمیل تایید
   - قالب‌های زیبای فارسی
   - ارسال ایمیل خوش‌آمدگویی

3. **محافظت کامل از صفحات**
   - تمام صفحات پشت لاگین
   - فقط Login/Register/RegisterPhone عمومی

4. **پیکربندی Nginx**
   - تنظیمات vteemo.com
   - SSL/HTTPS
   - امنیت بالا

## 🚀 شروع سریع (Development)

```bash
# کلون پروژه
git clone https://github.com/hassao66/vteemo-v10.git
cd vteemo-v10

# نصب
npm install

# تنظیم .env
cp .env.example .env
# ویرایش .env و تنظیم API Keys

# اجرا
npm run dev
```

مرورگر: http://localhost:5173

## 📦 استقرار در Production

### پیش‌نیازها

1. ✅ سرور با IP: 185.126.203.170
2. ✅ دامنه: vteemo.com
3. ✅ حساب FarazSMS
4. ✅ حساب Email.ir
5. ✅ Backend API آماده

### مراحل استقرار

```bash
# 1. Build پروژه
npm run build

# 2. استقرار (خودکار)
./deploy.sh

# یا دستی:
rsync -avz dist/ root@185.126.203.170:/var/www/vteemo/dist/
```

### نصب Nginx و SSL

```bash
# در سرور
sudo apt install nginx certbot python3-certbot-nginx

# کپی پیکربندی
sudo cp nginx-site.conf /etc/nginx/sites-available/vteemo
sudo ln -s /etc/nginx/sites-available/vteemo /etc/nginx/sites-enabled/

# دریافت SSL
sudo certbot --nginx -d vteemo.com -d www.vteemo.com

# راه‌اندازی
sudo systemctl restart nginx
```

## 🔑 متغیرهای محیطی مورد نیاز

```env
# .env
VITE_APP_URL=https://vteemo.com
VITE_API_URL=https://api.vteemo.com/api

# FarazSMS
VITE_FARAZSMS_API_KEY=your_key
VITE_FARAZSMS_SENDER=1000000000

# Email.ir
VITE_EMAILIR_API_KEY=your_key
VITE_EMAILIR_FROM_EMAIL=noreply@vteemo.com
```

## 🔧 Backend API مورد نیاز

Backend باید این endpoint‌ها را داشته باشد:

```
POST /api/auth/register/phone/send-otp
POST /api/auth/register/verify
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh
```

نمونه Request/Response در [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md)

## 📱 تست احراز هویت

### ثبت‌نام با موبایل

1. به `/register/phone` بروید
2. شماره: 09123456789
3. کد OTP دریافت می‌شود
4. وارد کردن کد و تکمیل ثبت‌نام

### ورود

1. به `/login` بروید
2. نام کاربری یا ایمیل + رمز عبور
3. وارد سیستم شوید

### تست Protected Routes

1. بدون login به `/` بروید → redirect به `/login`
2. بعد از login به همه صفحات دسترسی دارید

## 📚 مستندات کامل

- 📋 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - چک‌لیست کامل استقرار
- 🌐 [NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md) - راهنمای Nginx و SSL
- 📱 [IRANIAN-SERVICES-SETUP.md](./IRANIAN-SERVICES-SETUP.md) - راهنمای FarazSMS و Email.ir
- 📖 [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - جزئیات فنی کامل

## 🐛 مشکلات رایج

### پیامک ارسال نمی‌شود
- ✅ API Key را بررسی کنید
- ✅ اعتبار حساب را چک کنید
- ✅ شماره فرستنده را تایید کنید

### ایمیل ارسال نمی‌شود
- ✅ دامنه را در Email.ir تایید کنید
- ✅ DNS Records را بررسی کنید
- ✅ API Key را چک کنید

### 502 Bad Gateway
- ✅ Backend API را بررسی کنید
- ✅ Nginx config را چک کنید
- ✅ لاگ‌ها را ببینید

### SSL Certificate Error
- ✅ Certbot را دوباره اجرا کنید
- ✅ Nginx را reload کنید

## 🔗 لینک‌های مهم

- **Frontend**: https://vteemo.com
- **API**: https://api.vteemo.com/api
- **Server IP**: 185.126.203.170
- **GitHub**: https://github.com/hassao66/vteemo-v10

## 📞 پشتیبانی

- **Email**: support@vteemo.com
- **GitHub Issues**: https://github.com/hassao66/vteemo-v10/issues

## ⚡ دستورات مفید

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Deploy
./deploy.sh

# Server logs
ssh root@185.126.203.170 "tail -f /var/log/nginx/vteemo_error.log"

# Reload Nginx
ssh root@185.126.203.170 "sudo systemctl reload nginx"
```

## 🎯 نکات مهم

1. ⚠️ API Keys را **فقط در backend** قرار دهید
2. ⚠️ همیشه از HTTPS استفاده کنید
3. ⚠️ Rate limiting فعال کنید
4. ⚠️ لاگ‌ها را مانیتور کنید
5. ⚠️ پشتیبان‌گیری منظم داشته باشید

## ✅ چک‌لیست آماده‌سازی Production

- [ ] Backend API آماده و تست شده
- [ ] FarazSMS حساب و API Key
- [ ] Email.ir حساب و تایید دامنه
- [ ] DNS Records تنظیم شده
- [ ] .env با مقادیر production
- [ ] Build موفق
- [ ] Nginx نصب و پیکربندی
- [ ] SSL Certificate دریافت شده
- [ ] Firewall تنظیم شده
- [ ] لاگ‌ها در حال مانیتورینگ
- [ ] پشتیبان‌گیری فعال

---

موفق باشید! 🚀
