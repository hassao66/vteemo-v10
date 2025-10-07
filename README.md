# Vteemo (ویتیمو) - پلتفرم ویدیویی پیشرفته

پلتفرم کاملی برای اشتراک‌گذاری ویدیو با پنل مدیریت جامع و احراز هویت ایرانی

## ویژگی‌های کلیدی

- 🎥 پخش و مشاهده ویدیو
- 👤 احراز هویت با شماره موبایل ایرانی (FarazSMS)
- 📧 احراز هویت با ایمیل ایرانی (Email.ir)
- 🔐 تمام صفحات محافظت شده با سیستم لاگین
- 📤 آپلود و مدیریت ویدیو
- 🎙️ پخش زنده و پادکست
- 💰 کیف پول و سیستم پاداش
- 📊 پنل مدیریت جامع
- 🔍 جستجو و دسته‌بندی
- 📱 طراحی کاملاً ریسپانسیو و RTL
- 🌙 پشتیبانی از حالت تاریک
- 🔒 امنیت بالا با HTTPS و SSL

## نصب و راه‌اندازی سریع

### پیش‌نیازها

- Node.js 18 یا بالاتر
- npm یا yarn
- دسترسی به سرویس‌های FarazSMS و Email.ir (برای production)

### مراحل نصب (Development)

1. **کلون کردن پروژه**

```bash
git clone https://github.com/hassao66/vteemo-v10.git
cd vteemo-v10
```

2. **نصب وابستگی‌ها**

```bash
npm install
```

3. **تنظیم متغیرهای محیطی**

```bash
cp .env.example .env
# ویرایش فایل .env و تنظیم API Keys
```

4. **اجرای پروژه در حالت Development**

```bash
npm run dev
```

مرورگر خود را باز کنید و به `http://localhost:5173` بروید.

### استقرار در Production

برای استقرار کامل پروژه، راهنماهای زیر را دنبال کنید:

1. 📋 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - چک‌لیست کامل استقرار
2. 🌐 [NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md) - راهنمای Nginx و SSL
3. 📱 [IRANIAN-SERVICES-SETUP.md](./IRANIAN-SERVICES-SETUP.md) - راهنمای سرویس‌های ایرانی
4. 📖 [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - خلاصه پیاده‌سازی

### استقرار سریع با Script

```bash
# تنظیم متغیرهای محیطی (اختیاری)
export SERVER_IP=185.126.203.170
export SERVER_USER=root
export DEPLOY_PATH=/var/www/vteemo

# اجرای script استقرار
./deploy.sh
```

## اطلاعات سرور

- **Domain**: https://vteemo.com
- **API**: https://api.vteemo.com/api
- **Server IP**: 185.126.203.170

## معماری سیستم

```
Frontend (React + TypeScript + Vite)
  ↓
Nginx (SSL/TLS, Proxy, Security)
  ↓
Backend API (Node.js/Python/etc)
  ↓
┌─────────────┬──────────────┐
│  FarazSMS   │  Email.ir    │
│  (پیامک)    │  (ایمیل)     │
└─────────────┴──────────────┘
```

## ساختار پروژه

```
src/
├── components/          # کامپوننت‌های قابل استفاده مجدد
├── pages/              # صفحات اصلی
├── contexts/           # Context های React
├── hooks/              # Custom hooks
├── utils/              # توابع کمکی
└── styles/             # فایل‌های CSS

public/                 # فایل‌های استاتیک
```

## تکنولوژی‌های استفاده شده

### Frontend
- **Framework**: React 18 با TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API

### Backend Requirements
- **Authentication**: Custom JWT-based API
- **SMS**: FarazSMS API
- **Email**: Email.ir API
- **Database**: PostgreSQL/MySQL (توصیه می‌شود)

### Infrastructure
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Deployment**: VPS/Dedicated Server

## ویژگی‌های احراز هویت

### ثبت‌نام با شماره موبایل
1. کاربر شماره موبایل خود را وارد می‌کند (09xxxxxxxxx)
2. کد OTP 6 رقمی از طریق FarazSMS ارسال می‌شود
3. کاربر کد را تایید می‌کند
4. نام کاربری و رمز عبور تنظیم می‌شود
5. وارد سیستم می‌شود

### ثبت‌نام با ایمیل
1. کاربر ایمیل خود را وارد می‌کند
2. کد تایید از طریق Email.ir ارسال می‌شود
3. حساب کاربری فعال می‌شود

### محافظت از صفحات
- تمام صفحات به جز Login/Register/RegisterPhone محافظت شده‌اند
- کاربران بدون لاگین به صفحه ورود هدایت می‌شوند
- پنل ادمین فقط برای ادمین‌ها قابل دسترسی است

## مستندات

- 📋 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - چک‌لیست استقرار
- 🌐 [NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md) - راهنمای Nginx و SSL
- 📱 [IRANIAN-SERVICES-SETUP.md](./IRANIAN-SERVICES-SETUP.md) - راهنمای FarazSMS و Email.ir
- 📖 [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - خلاصه کامل پیاده‌سازی

## مشارکت

این پروژه توسط [hassao66](https://github.com/hassao66) توسعه داده شده است.

## پشتیبانی

- **Website**: https://vteemo.com
- **Email**: support@vteemo.com
- **GitHub**: https://github.com/hassao66/vteemo-v10

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.
