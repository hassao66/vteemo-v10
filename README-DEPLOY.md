# 🚀 راهنمای Deploy Vteemo روی Ubuntu Server

## پیشنیازها
- سرور Ubuntu 20.04 یا بالاتر
- دسترسی SSH با sudo
- پورت 80 باز باشد

## مراحل نصب

### گام 1: آپلود فایلها
```bash
# روی کامپیوتر خودتان:
scp -r vteemo-new-version root@YOUR_SERVER_IP:/root/
```

یا اگر با Git کار می‌کنید:
```bash
# SSH به سرور
ssh root@YOUR_SERVER_IP

# کلون پروژه
git clone https://github.com/hassao66/vteemo-new-version.git
cd vteemo-new-version
```

### گام 2: اجرای اسکریپت نصب
```bash
# SSH به سرور
ssh root@YOUR_SERVER_IP

# رفتن به پوشه پروژه
cd /root/vteemo-new-version

# اجازه اجرا به اسکریپت
chmod +x deploy.sh

# اجرای اسکریپت
sudo ./deploy.sh
```

اسکریپت به صورت خودکار:
- ✅ Node.js 20 را نصب می‌کند
- ✅ Nginx را نصب و پیکربندی می‌کند
- ✅ Dependencies را نصب می‌کند
- ✅ پروژه را Build می‌کند
- ✅ فایلها را در `/var/www/vteemo` کپی می‌کند
- ✅ Permissions را تنظیم می‌کند
- ✅ Nginx را راه‌اندازی می‌کند

### گام 3: بررسی نصب
پس از اتمام نصب:
1. در مرورگر به `http://YOUR_SERVER_IP` بروید
2. سایت باید بارگذاری شود!

## بررسی لاگها
```bash
# لاگهای Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# وضعیت Nginx
sudo systemctl status nginx
```

## عیبیابی

### مشکل 1: صفحه سفید
```bash
# بررسی فایلها
ls -la /var/www/vteemo/

# بررسی permissions
sudo chown -R www-data:www-data /var/www/vteemo

# بررسی محتوای index.html
cat /var/www/vteemo/index.html
```

### مشکل 2: خطای 404
```bash
# بررسی تنظیمات Nginx
sudo nginx -t

# Restart
sudo systemctl restart nginx

# بررسی لاگ خطا
sudo tail -100 /var/log/nginx/error.log
```

### مشکل 3: خطای manifest
```bash
# بررسی فایل manifest
cat /var/www/vteemo/manifest.json

# بررسی Content-Type
curl -I http://YOUR_SERVER_IP/manifest.json
```

### مشکل 4: خطای JavaScript
```bash
# بررسی فایلهای JS
ls -la /var/www/vteemo/assets/

# تست دسترسی به فایل JS
curl http://YOUR_SERVER_IP/assets/index-*.js
```

## Update کردن سایت

### روش 1: با Git
```bash
cd /root/vteemo-new-version
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/vteemo/
sudo systemctl restart nginx
```

### روش 2: آپلود مستقیم
```bash
# روی کامپیوتر خودتان build بگیرید
npm run build

# فایلهای dist را آپلود کنید
scp -r dist/* root@YOUR_SERVER_IP:/var/www/vteemo/

# روی سرور
ssh root@YOUR_SERVER_IP
sudo chown -R www-data:www-data /var/www/vteemo
sudo systemctl restart nginx
```

## تنظیمات پیشرفته

### فعال‌سازی HTTPS با Let's Encrypt
```bash
# نصب Certbot
sudo apt-get install certbot python3-certbot-nginx

# دریافت SSL Certificate
sudo certbot --nginx -d YOUR_DOMAIN.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

### تنظیم Firewall
```bash
# فعال‌سازی UFW
sudo ufw enable

# باز کردن پورت‌ها
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# بررسی وضعیت
sudo ufw status
```

### مانیتورینگ با PM2 (اختیاری)
اگر می‌خواهید از PM2 برای مانیتورینگ استفاده کنید:
```bash
# نصب PM2
sudo npm install -g pm2

# اجرای برنامه
pm2 start npm --name "vteemo" -- run preview

# ذخیره تنظیمات
pm2 save
pm2 startup
```

## نصب با Docker (روش جایگزین)

اگر ترجیح می‌دهید از Docker استفاده کنید:

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Build و اجرا
docker-compose up -d

# بررسی وضعیت
docker-compose ps
```

## پشتیبان‌گیری

### Backup خودکار
```bash
# ایجاد اسکریپت backup
sudo nano /root/backup-vteemo.sh
```

محتوا:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup فایلها
tar -czf $BACKUP_DIR/vteemo_$DATE.tar.gz /var/www/vteemo

# پاکسازی backupهای قدیمی (بیشتر از 30 روز)
find $BACKUP_DIR -name "vteemo_*.tar.gz" -mtime +30 -delete

echo "Backup completed: vteemo_$DATE.tar.gz"
```

```bash
# اجازه اجرا
chmod +x /root/backup-vteemo.sh

# اضافه کردن به cron برای اجرای روزانه
crontab -e
# اضافه کردن این خط:
# 0 2 * * * /root/backup-vteemo.sh
```

## بهینه‌سازی عملکرد

### افزایش سرعت Nginx
ویرایش `/etc/nginx/nginx.conf`:
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}
```

### فعال‌سازی HTTP/2
در فایل `/etc/nginx/sites-available/vteemo`:
```nginx
listen 443 ssl http2;
```

## مسائل امنیتی

### محدود کردن دسترسی به فایلهای حساس
```bash
# در Nginx config
location ~ /\.(git|env) {
    deny all;
}
```

### تنظیم Headers امنیتی
Headers زیر در `nginx-site.conf` قبلاً اضافه شده:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## سوالات متداول

**Q: چطور می‌توانم دامنه خودم را متصل کنم؟**
A: در فایل `/etc/nginx/sites-available/vteemo` خط `server_name _;` را با دامنه خود جایگزین کنید:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

**Q: چگونه متوجه شوم سایت در حال اجرا است؟**
A: دستور زیر را اجرا کنید:
```bash
curl -I http://localhost
```
باید پاسخ HTTP 200 دریافت کنید.

**Q: چگونه پورت را تغییر دهم؟**
A: در `/etc/nginx/sites-available/vteemo` خط `listen 80;` را تغییر دهید، مثلاً:
```nginx
listen 8080;
```

## پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های Nginx را بررسی کنید
2. وضعیت Nginx را چک کنید: `sudo systemctl status nginx`
3. Build را مجدداً انجام دهید
4. مطمئن شوید تمام dependencies نصب شده‌اند

---

**نکته مهم**: قبل از اجرای در production، حتماً:
- ✅ متغیرهای محیطی (Environment Variables) را تنظیم کنید
- ✅ SSL Certificate نصب کنید
- ✅ Firewall را پیکربندی کنید
- ✅ Backup منظم تنظیم کنید
