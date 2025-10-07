# چک‌لیست استقرار vteemo.com

## قبل از استقرار

### 1. سرویس‌های شخص ثالث
- [ ] ثبت‌نام در FarazSMS و دریافت API Key
- [ ] ثبت‌نام در Email.ir و دریافت API Key
- [ ] تایید دامنه vteemo.com در Email.ir
- [ ] خرید اعتبار پیامک در FarazSMS

### 2. DNS Configuration
- [ ] رکورد A برای vteemo.com → 185.126.203.170
- [ ] رکورد A برای www.vteemo.com → 185.126.203.170
- [ ] رکورد CNAME برای api.vteemo.com → vteemo.com
- [ ] رکوردهای Email.ir (SPF, DKIM, MX)

### 3. سرور (185.126.203.170)
- [ ] دسترسی SSH به سرور
- [ ] نصب Node.js (v18 یا بالاتر)
- [ ] نصب Nginx
- [ ] نصب Certbot
- [ ] فایروال تنظیم شده (پورت‌های 80, 443, 22)

## مراحل استقرار Frontend

### 1. آماده‌سازی کد

```bash
# Clone repository
git clone https://github.com/hassao66/vteemo-v10.git
cd vteemo-v10

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 2. تنظیم متغیرهای محیطی

ویرایش `.env`:

```env
VITE_APP_NAME=Vteemo
VITE_APP_URL=https://vteemo.com
VITE_API_URL=https://api.vteemo.com/api

VITE_FARAZSMS_API_KEY=<your_key>
VITE_FARAZSMS_BASE_URL=https://api.farazsms.com/v2
VITE_FARAZSMS_SENDER=<your_sender_number>

VITE_EMAILIR_API_KEY=<your_key>
VITE_EMAILIR_BASE_URL=https://api.email.ir/v1
VITE_EMAILIR_FROM_EMAIL=noreply@vteemo.com
VITE_EMAILIR_FROM_NAME=ویتیمو
```

### 3. Build پروژه

```bash
npm run build
```

### 4. آپلود به سرور

```bash
# با rsync
rsync -avz --delete dist/ root@185.126.203.170:/var/www/vteemo/dist/

# یا با scp
scp -r dist/* root@185.126.203.170:/var/www/vteemo/dist/
```

## مراحل استقرار Backend

### 1. آماده‌سازی دایرکتوری

```bash
# در سرور
ssh root@185.126.203.170

mkdir -p /var/www/vteemo-api
cd /var/www/vteemo-api
```

### 2. نصب Backend

Backend شما باید شامل endpoint‌های زیر باشد:
- `/api/auth/register/phone/send-otp`
- `/api/auth/register/verify`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/refresh`

### 3. راه‌اندازی با PM2

```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی backend
cd /var/www/vteemo-api
npm install
pm2 start server.js --name vteemo-api
pm2 save
pm2 startup
```

## مراحل پیکربندی Nginx

### 1. کپی فایل پیکربندی اولیه

```bash
# در سرور
sudo nano /etc/nginx/sites-available/vteemo
```

پیکربندی موقت (قبل از SSL):

```nginx
server {
    listen 80;
    server_name vteemo.com www.vteemo.com;
    
    root /var/www/vteemo/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
```

### 2. فعال‌سازی سایت

```bash
sudo ln -s /etc/nginx/sites-available/vteemo /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 3. دریافت SSL Certificate

```bash
sudo mkdir -p /var/www/certbot
sudo certbot --nginx -d vteemo.com -d www.vteemo.com
```

### 4. پیکربندی نهایی

```bash
# کپی پیکربندی کامل از پروژه
sudo cp /path/to/project/nginx-site.conf /etc/nginx/sites-available/vteemo
sudo nginx -t
sudo systemctl reload nginx
```

## تست‌های پس از استقرار

### 1. تست دامنه و SSL
- [ ] https://vteemo.com بارگذاری می‌شود
- [ ] HTTP به HTTPS redirect می‌شود
- [ ] گواهی SSL معتبر است (قفل سبز)
- [ ] www.vteemo.com کار می‌کند

### 2. تست احراز هویت
- [ ] صفحه login بارگذاری می‌شود
- [ ] صفحه register بارگذاری می‌شود
- [ ] صفحه register/phone بارگذاری می‌شود
- [ ] ثبت‌نام با موبایل کار می‌کند
- [ ] ارسال OTP موفقیت‌آمیز است
- [ ] ورود به سیستم کار می‌کند

### 3. تست Protected Routes
- [ ] بدون login نمی‌توان به / دسترسی داشت
- [ ] redirect به /login درست کار می‌کند
- [ ] بعد از login می‌توان به صفحات دسترسی داشت
- [ ] خروج از سیستم درست کار می‌کند

### 4. تست API
- [ ] `/api/auth/login` پاسخ می‌دهد
- [ ] `/api/auth/register/phone/send-otp` پاسخ می‌دهد
- [ ] CORS درست تنظیم شده است
- [ ] Headers امنیتی فعال هستند

### 5. تست عملکرد
- [ ] صفحات به سرعت بارگذاری می‌شوند
- [ ] فایل‌های static از cache استفاده می‌کنند
- [ ] Gzip فعال است
- [ ] Mobile responsive است

### 6. تست امنیت
- [ ] HTTPS اجباری است
- [ ] HSTS header فعال است
- [ ] Security headers فعال هستند
- [ ] XSS Protection فعال است
- [ ] Content Security Policy فعال است

## نظارت و نگهداری

### 1. لاگ‌ها

```bash
# لاگ‌های Nginx
sudo tail -f /var/log/nginx/vteemo_access.log
sudo tail -f /var/log/nginx/vteemo_error.log

# لاگ‌های Backend
pm2 logs vteemo-api
```

### 2. مانیتورینگ

```bash
# وضعیت Nginx
sudo systemctl status nginx

# وضعیت Backend
pm2 status

# استفاده از منابع
htop
```

### 3. پشتیبان‌گیری

```bash
# پشتیبان از فایل‌های پیکربندی
sudo cp -r /etc/nginx/sites-available /backup/nginx-$(date +%Y%m%d)

# پشتیبان از فایل‌های وب
tar -czf /backup/vteemo-$(date +%Y%m%d).tar.gz /var/www/vteemo
```

### 4. بروزرسانی‌ها

```bash
# بروزرسانی امنیتی سیستم
sudo apt update
sudo apt upgrade -y

# تمدید SSL (خودکار است)
sudo certbot renew --dry-run
```

## عیب‌یابی رایج

### مشکل: 502 Bad Gateway
```bash
# بررسی backend
pm2 status
pm2 logs vteemo-api

# راه‌اندازی مجدد
pm2 restart vteemo-api
```

### مشکل: 403 Forbidden
```bash
# بررسی permissions
sudo chown -R www-data:www-data /var/www/vteemo
sudo chmod -R 755 /var/www/vteemo
```

### مشکل: SSL Certificate نیست
```bash
# راه‌اندازی مجدد Certbot
sudo certbot --nginx -d vteemo.com -d www.vteemo.com --force-renewal
```

### مشکل: پیامک ارسال نمی‌شود
1. بررسی API Key در backend
2. بررسی اعتبار حساب FarazSMS
3. بررسی لاگ‌های backend

### مشکل: CORS Error
```bash
# بررسی پیکربندی backend
# اطمینان از allow origin: https://vteemo.com
```

## اطلاعات تماس

- **Domain**: vteemo.com
- **Server IP**: 185.126.203.170
- **API URL**: https://api.vteemo.com/api
- **Support Email**: support@vteemo.com

## منابع مفید

- [NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md) - راهنمای کامل Nginx و SSL
- [IRANIAN-SERVICES-SETUP.md](./IRANIAN-SERVICES-SETUP.md) - راهنمای سرویس‌های ایرانی
- [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - خلاصه پیاده‌سازی

## یادداشت‌های مهم

⚠️ **توجه**: قبل از استقرار، حتماً:
1. از backend API اطمینان حاصل کنید
2. API Keys را در backend (نه frontend) قرار دهید
3. از HTTPS برای تمام ارتباطات استفاده کنید
4. Rate limiting را فعال کنید
5. پشتیبان‌گیری منظم داشته باشید

✅ **موفقیت**: پس از اتمام این مراحل، سایت شما باید کاملاً functional باشد!
