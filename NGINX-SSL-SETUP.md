# راهنمای نصب و پیکربندی Nginx با SSL برای vteemo.com

## پیش‌نیازها

- سرور Ubuntu/Debian با دسترسی root یا sudo
- دامنه vteemo.com که به IP سرور (185.126.203.170) اشاره کند
- پورت‌های 80 و 443 باز باشند

## مرحله 1: نصب Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

## مرحله 2: نصب Certbot برای SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## مرحله 3: پیکربندی DNS

اطمینان حاصل کنید که رکوردهای DNS زیر به درستی تنظیم شده‌اند:

```
Type: A
Name: @
Value: 185.126.203.170

Type: A
Name: www
Value: 185.126.203.170

Type: CNAME
Name: api
Value: vteemo.com
```

## مرحله 4: ساخت دایرکتوری پروژه

```bash
sudo mkdir -p /var/www/vteemo
sudo chown -R $USER:$USER /var/www/vteemo
```

## مرحله 5: کپی فایل‌های build

```bash
# در سرور، فایل‌های dist را به مسیر زیر کپی کنید:
# /var/www/vteemo/dist
```

یا با استفاده از rsync از لوکال:

```bash
rsync -avz --delete dist/ user@185.126.203.170:/var/www/vteemo/dist/
```

## مرحله 6: پیکربندی Nginx

```bash
# کپی فایل پیکربندی
sudo cp nginx-site.conf /etc/nginx/sites-available/vteemo

# ابتدا پیکربندی موقت برای دریافت SSL (بدون HTTPS)
sudo nano /etc/nginx/sites-available/vteemo
```

**پیکربندی اولیه موقت** (قبل از SSL):

```nginx
server {
    listen 80;
    server_name vteemo.com www.vteemo.com;
    
    root /var/www/vteemo/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
```

```bash
# فعال کردن سایت
sudo ln -s /etc/nginx/sites-available/vteemo /etc/nginx/sites-enabled/

# حذف پیکربندی پیش‌فرض (اختیاری)
sudo rm /etc/nginx/sites-enabled/default

# تست پیکربندی
sudo nginx -t

# راه‌اندازی مجدد Nginx
sudo systemctl restart nginx
```

## مرحله 7: دریافت گواهی SSL با Let's Encrypt

```bash
# ایجاد دایرکتوری برای Certbot
sudo mkdir -p /var/www/certbot

# دریافت گواهی SSL
sudo certbot --nginx -d vteemo.com -d www.vteemo.com
```

در طول نصب:
- ایمیل خود را وارد کنید
- شرایط استفاده را بپذیرید
- گزینه Redirect (2) را انتخاب کنید

## مرحله 8: بروزرسانی پیکربندی نهایی Nginx

پس از دریافت SSL، فایل nginx-site.conf کامل را کپی کنید:

```bash
sudo cp nginx-site.conf /etc/nginx/sites-available/vteemo
sudo nginx -t
sudo systemctl reload nginx
```

## مرحله 9: تنظیم تمدید خودکار SSL

```bash
# تست تمدید خودکار
sudo certbot renew --dry-run

# افزودن Cron Job برای تمدید خودکار (اگر نیاز باشد)
sudo crontab -e
```

اضافه کردن این خط:
```
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

## مرحله 10: بررسی وضعیت

```bash
# بررسی وضعیت Nginx
sudo systemctl status nginx

# مشاهده لاگ‌ها
sudo tail -f /var/log/nginx/vteemo_access.log
sudo tail -f /var/log/nginx/vteemo_error.log
```

## تست سایت

1. باز کردن https://vteemo.com در مرورگر
2. بررسی گواهی SSL (باید قفل سبز نشان دهد)
3. تست redirect از HTTP به HTTPS

## عیب‌یابی

### مشکل: گواهی SSL دریافت نمی‌شود

```bash
# بررسی وضعیت فایروال
sudo ufw status
sudo ufw allow 'Nginx Full'

# بررسی DNS
nslookup vteemo.com
```

### مشکل: 502 Bad Gateway

```bash
# بررسی سرویس backend
sudo systemctl status your-backend-service

# یا اگر با Node.js اجرا می‌شود:
ps aux | grep node
```

### مشکل: فایل‌های static لود نمی‌شوند

```bash
# بررسی مجوزها
sudo chown -R www-data:www-data /var/www/vteemo
sudo chmod -R 755 /var/www/vteemo
```

## توصیه‌های امنیتی

1. **فایروال را فعال کنید:**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

2. **بروزرسانی‌های امنیتی:**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **بررسی لاگ‌ها به صورت منظم:**
```bash
sudo tail -f /var/log/nginx/vteemo_error.log
```

4. **پشتیبان‌گیری:**
```bash
# پشتیبان از فایل‌های پیکربندی
sudo cp /etc/nginx/sites-available/vteemo /etc/nginx/sites-available/vteemo.backup
```

## بروزرسانی پروژه

برای بروزرسانی فایل‌های frontend:

```bash
# 1. Build پروژه
npm run build

# 2. آپلود به سرور
rsync -avz --delete dist/ user@185.126.203.170:/var/www/vteemo/dist/

# 3. پاک کردن cache Nginx (اختیاری)
ssh user@185.126.203.170 "sudo nginx -s reload"
```

## پیکربندی Backend API

اگر backend API روی همان سرور است:

```bash
# نصب Node.js (اگر نیاز است)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# نصب PM2 برای مدیریت process
sudo npm install -g pm2

# اجرای backend
cd /path/to/backend
npm install
pm2 start server.js --name vteemo-api
pm2 save
pm2 startup
```

## منابع

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot](https://certbot.eff.org/)
