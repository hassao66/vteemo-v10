# 🚀 راهنمای سریع Deploy

این پروژه اکنون آماده Deploy مستقیم روی سرور Ubuntu است!

## روش‌های Deploy

### 1️⃣ روش سریع - اسکریپت خودکار (توصیه می‌شود)

```bash
# دانلود پروژه روی سرور
git clone https://github.com/hassao66/vteemo-new-version.git
cd vteemo-new-version

# اجرای اسکریپت نصب خودکار
sudo ./deploy.sh
```

**این اسکریپت به صورت خودکار:**
- ✅ Node.js 20 را نصب می‌کند
- ✅ Nginx را نصب و پیکربندی می‌کند  
- ✅ پروژه را Build می‌کند
- ✅ فایلها را در مسیر صحیح کپی می‌کند
- ✅ سرور را راه‌اندازی می‌کند

پس از اتمام نصب، سایت در `http://YOUR_SERVER_IP` در دسترس است!

### 2️⃣ روش Docker (ساده و قابل حمل)

```bash
# نصب Docker (اگر نصب نیست)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# اجرای پروژه
docker-compose up -d

# بررسی وضعیت
docker-compose ps
```

### 3️⃣ روش دستی

```bash
# نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# نصب Nginx
sudo apt-get install -y nginx

# Build پروژه
npm install
npm run build

# کپی فایلها
sudo mkdir -p /var/www/vteemo
sudo cp -r dist/* /var/www/vteemo/

# تنظیم Nginx
sudo cp nginx-site.conf /etc/nginx/sites-available/vteemo
sudo ln -sf /etc/nginx/sites-available/vteemo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# راه‌اندازی
sudo systemctl restart nginx
```

## 📁 فایلهای مهم

| فایل | توضیحات |
|------|---------|
| `deploy.sh` | اسکریپت نصب خودکار برای Ubuntu |
| `nginx-site.conf` | تنظیمات Nginx برای Ubuntu Server |
| `nginx-docker.conf` | تنظیمات Nginx برای Docker |
| `README-DEPLOY.md` | راهنمای کامل با عیب‌یابی |
| `Dockerfile` | فایل Docker با two-stage build |
| `docker-compose.yml` | تنظیمات Docker Compose |
| `.github/workflows/build.yml` | GitHub Actions برای build خودکار |

## 🔍 بررسی سلامت سرور

```bash
# وضعیت Nginx
sudo systemctl status nginx

# لاگهای Nginx
sudo tail -f /var/log/nginx/error.log

# تست دسترسی
curl -I http://localhost
```

## 🆘 عیب‌یابی سریع

### صفحه سفید؟
```bash
# بررسی فایلها
ls -la /var/www/vteemo/

# بررسی index.html
cat /var/www/vteemo/index.html
```

### خطای 404؟
```bash
# تست تنظیمات Nginx
sudo nginx -t

# راه‌اندازی مجدد
sudo systemctl restart nginx
```

### فایلهای JS لود نمی‌شوند؟
```bash
# بررسی permissions
sudo chown -R www-data:www-data /var/www/vteemo
sudo chmod -R 755 /var/www/vteemo
```

## 📚 مستندات کامل

برای راهنمای دقیق‌تر، فایل [README-DEPLOY.md](README-DEPLOY.md) را مطالعه کنید.

## ✨ ویژگی‌های جدید

- ✅ Deploy خودکار با یک دستور
- ✅ پشتیبانی از Docker و Docker Compose
- ✅ GitHub Actions برای build خودکار
- ✅ تنظیمات Nginx بهینه برای React SPA
- ✅ پشتیبانی از gzip compression
- ✅ Cache بهینه برای فایلهای استاتیک
- ✅ Headers امنیتی پیکربندی شده
- ✅ React Router support کامل

## 🎯 مراحل بعدی (اختیاری)

1. **نصب SSL Certificate**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

2. **تنظیم Firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow 80
   sudo ufw allow 443
   ```

3. **تنظیم Backup خودکار**
   ```bash
   # از اسکریپت backup.sh موجود در پروژه استفاده کنید
   chmod +x backup.sh
   # اضافه به cron
   ```

---

**نکته**: این پروژه اکنون کاملاً آماده برای Production است!
