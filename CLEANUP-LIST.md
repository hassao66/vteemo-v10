# 🗑️ لیست فایل‌های موقت برای حذف
# این فایل‌ها فقط برای تست و راه‌اندازی هستند
# بعد از دیپلوی نهایی باید حذف شوند

## فایل‌های تست و راه‌اندازی:
- check-database.js
- setup-missing-database.js
- setup-comments.sql
- SETUP-DATABASE-MANUAL.md
- CLEANUP-LIST.md (این فایل)

## پوشه‌های غیر ضروری:
- backend/ (اگر از Supabase استفاده می‌کنید)
- .bolt/ (فایل‌های موقت bolt)

## دستور پاکسازی خودکار (بعد از دیپلوی):

### ویندوز (PowerShell):
```powershell
Remove-Item -Path "check-database.js", "setup-missing-database.js", "setup-comments.sql", "SETUP-DATABASE-MANUAL.md", "CLEANUP-LIST.md" -Force
Remove-Item -Recurse -Path "backend", ".bolt" -Force -ErrorAction SilentlyContinue
```

### لینوکس/مک:
```bash
rm -f check-database.js setup-missing-database.js setup-comments.sql SETUP-DATABASE-MANUAL.md CLEANUP-LIST.md
rm -rf backend .bolt
```

## یادآوری:
این فایل‌ها را **فقط بعد از دیپلوی موفق و تست کامل** حذف کنید! ✅
