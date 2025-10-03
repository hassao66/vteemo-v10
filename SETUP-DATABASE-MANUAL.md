# 🔧 راهنمای تکمیل دیتابیس Supabase
# این فایل بعد از اتمام پروژه حذف می‌شود

## ⚠️ کارهایی که باید انجام دهید (5 دقیقه)

### مرحله 1: ایجاد جدول Comments (2 دقیقه)

1. به پنل Supabase بروید: https://supabase.com/dashboard
2. پروژه خود را انتخاب کنید
3. از منوی سمت چپ **SQL Editor** را باز کنید
4. روی **New Query** کلیک کنید
5. محتویات فایل `setup-comments.sql` را کپی کنید
6. در Query Editor paste کنید
7. روی دکمه **RUN** کلیک کنید
8. ✅ باید پیغام "Success" ببینید

---

### مرحله 2: ایجاد Storage Buckets (3 دقیقه)

#### Bucket 1: videos
1. از منوی سمت چپ **Storage** را انتخاب کنید
2. روی **New bucket** کلیک کنید
3. تنظیمات:
   - Name: `videos`
   - Public bucket: ✅ فعال کنید
   - File size limit: `500` MB
   - Allowed MIME types: `video/*` (یا خالی بگذارید)
4. روی **Create bucket** کلیک کنید

#### Bucket 2: thumbnails
1. روی **New bucket** کلیک کنید
2. تنظیمات:
   - Name: `thumbnails`
   - Public bucket: ✅ فعال کنید
   - File size limit: `5` MB
   - Allowed MIME types: `image/*` (یا خالی بگذارید)
3. روی **Create bucket** کلیک کنید

#### Bucket 3: avatars
1. روی **New bucket** کلیک کنید
2. تنظیمات:
   - Name: `avatars`
   - Public bucket: ✅ فعال کنید
   - File size limit: `2` MB
   - Allowed MIME types: `image/*` (یا خالی بگذارید)
3. روی **Create bucket** کلیک کنید

---

### مرحله 3: تنظیم دسترسی‌های Storage (اختیاری - می‌توانید بعداً انجام دهید)

برای هر bucket (videos، thumbnails، avatars):

1. روی bucket کلیک کنید
2. به تب **Policies** بروید
3. روی **New Policy** کلیک کنید
4. یک policy برای **INSERT** بسازید:
   ```
   Policy name: Allow authenticated users to upload
   Definition: (authenticated)
   ```
5. یک policy برای **SELECT** بسازید:
   ```
   Policy name: Allow public read access
   Definition: true
   ```

---

## ✅ تایید نهایی

بعد از انجام این کارها، در Terminal دستور زیر را اجرا کنید:

```bash
node check-database.js
```

باید آمادگی **100%** نشان دهد! 🎉

---

## 🆘 اگر مشکلی پیش آمد:

- جدول Comments ایجاد نشد → SQL را دوباره RUN کنید
- Bucket ایجاد نشد → نام را چک کنید (حروف کوچک، بدون فاصله)
- خطای دسترسی → مطمئن شوید Public bucket را فعال کرده‌اید
