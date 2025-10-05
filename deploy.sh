#!/bin/bash

# رنگها برای output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 شروع نصب Vteemo...${NC}"

# بررسی اجرا با sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}لطفاً این اسکریپت را با sudo اجرا کنید${NC}"
    exit 1
fi

# نصب Node.js و npm
echo -e "${YELLOW}📦 نصب Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# بررسی نصب Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}خطا: Node.js نصب نشد${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js نصب شد: $(node --version)${NC}"

# نصب Nginx
echo -e "${YELLOW}📦 نصب Nginx...${NC}"
sudo apt-get update
sudo apt-get install -y nginx

# بررسی نصب Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}خطا: Nginx نصب نشد${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx نصب شد: $(nginx -v 2>&1)${NC}"

# نصب dependencies
echo -e "${YELLOW}📦 نصب dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در نصب dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies نصب شد${NC}"

# Build پروژه
echo -e "${YELLOW}🔨 Build پروژه...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در build پروژه${NC}"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo -e "${RED}خطا: پوشه dist ایجاد نشد${NC}"
    exit 1
fi

echo -e "${GREEN}✅ پروژه build شد${NC}"

# کپی فایلها به Nginx
echo -e "${YELLOW}📂 کپی فایلها به /var/www/vteemo...${NC}"
sudo mkdir -p /var/www/vteemo
sudo cp -r dist/* /var/www/vteemo/

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در کپی فایلها${NC}"
    exit 1
fi

echo -e "${GREEN}✅ فایلها کپی شد${NC}"

# تنظیم permissions
echo -e "${YELLOW}🔐 تنظیم permissions...${NC}"
sudo chown -R www-data:www-data /var/www/vteemo
sudo chmod -R 755 /var/www/vteemo

# بررسی وجود فایل nginx.conf
if [ ! -f "nginx-site.conf" ]; then
    echo -e "${RED}خطا: فایل nginx-site.conf یافت نشد${NC}"
    exit 1
fi

# کپی تنظیمات Nginx
echo -e "${YELLOW}⚙️ تنظیم Nginx...${NC}"
sudo cp nginx-site.conf /etc/nginx/sites-available/vteemo
sudo ln -sf /etc/nginx/sites-available/vteemo /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# تست تنظیمات Nginx
echo -e "${YELLOW}🔍 تست تنظیمات Nginx...${NC}"
sudo nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در تنظیمات Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ تنظیمات Nginx صحیح است${NC}"

# Restart Nginx
echo -e "${YELLOW}🔄 راهاندازی مجدد Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در راهاندازی Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ نصب با موفقیت انجام شد!${NC}"
echo -e "${GREEN}🌐 سایت در http://YOUR_SERVER_IP در دسترس است${NC}"
echo -e "${YELLOW}📝 برای مشاهده لاگها: sudo tail -f /var/log/nginx/error.log${NC}"
