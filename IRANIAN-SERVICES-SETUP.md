# راهنمای راه‌اندازی سرویس‌های ایرانی

این راهنما شامل مراحل راه‌اندازی سرویس‌های پیامک و ایمیل ایرانی برای پروژه vteemo است.

## 1. سرویس پیامک FarazSMS

### ثبت‌نام و دریافت API Key

1. به سایت [FarazSMS](https://farazsms.com/) بروید
2. ثبت‌نام کنید و حساب کاربری خود را فعال کنید
3. از بخش "API" کلید API خود را دریافت کنید
4. یک خط اختصاصی برای ارسال پیامک خریداری کنید (یا از شماره‌های عمومی استفاده کنید)

### پیکربندی در پروژه

در فایل `.env` مقادیر زیر را تنظیم کنید:

```env
VITE_FARAZSMS_API_KEY=your_api_key_here
VITE_FARAZSMS_BASE_URL=https://api.farazsms.com/v2
VITE_FARAZSMS_SENDER=your_sender_number
```

### نمونه استفاده

```typescript
import farazSMSService from './services/farazsms.service';

// ارسال کد OTP
const result = await farazSMSService.sendOTP('09123456789', '123456');

// ارسال با الگو (Pattern)
const result = await farazSMSService.sendPattern(
  '09123456789',
  'pattern_code',
  { 'code': '123456', 'name': 'کاربر' }
);
```

### مستندات API

- [مستندات کامل FarazSMS](https://farazsms.com/documentation)
- [راهنمای API](https://farazsms.com/api-docs)

### سایر سرویس‌های پیامک ایرانی (جایگزین‌ها)

اگر می‌خواهید از سرویس دیگری استفاده کنید:

1. **کاوه‌نگار** - [kavenegar.com](https://kavenegar.com/)
2. **ملی‌پیامک** - [melipayamak.com](https://melipayamak.com/)
3. **پیامک باران** - [payamak-baran.ir](https://payamak-baran.ir/)
4. **اس‌ام‌اس آسان** - [smsasan.com](https://smsasan.com/)

## 2. سرویس ایمیل Email.ir

### ثبت‌نام و دریافت API Key

1. به سایت [Email.ir](https://email.ir/) بروید
2. ثبت‌نام کنید و حساب خود را فعال کنید
3. دامنه ایمیل خود را تایید کنید (vteemo.com)
4. از بخش "API" کلید API خود را دریافت کنید

### تایید دامنه

برای ارسال ایمیل از دامنه vteemo.com، باید رکوردهای DNS زیر را اضافه کنید:

```
Type: TXT
Name: @
Value: email-ir-verification=xxxxxxxxxxxxx

Type: TXT  
Name: @
Value: v=spf1 include:_spf.email.ir ~all

Type: CNAME
Name: em._domainkey
Value: em._domainkey.email.ir

Type: MX
Priority: 10
Value: mx1.email.ir

Type: MX
Priority: 20
Value: mx2.email.ir
```

### پیکربندی در پروژه

در فایل `.env`:

```env
VITE_EMAILIR_API_KEY=your_api_key_here
VITE_EMAILIR_BASE_URL=https://api.email.ir/v1
VITE_EMAILIR_FROM_EMAIL=noreply@vteemo.com
VITE_EMAILIR_FROM_NAME=ویتیمو
```

### نمونه استفاده

```typescript
import emailIrService from './services/emailir.service';

// ارسال ایمیل تایید
await emailIrService.sendVerificationEmail(
  'user@example.com',
  '123456',
  'username'
);

// ارسال ایمیل خوش‌آمدگویی
await emailIrService.sendWelcomeEmail(
  'user@example.com',
  'username'
);

// ارسال ایمیل بازیابی رمز عبور
await emailIrService.sendPasswordResetEmail(
  'user@example.com',
  'reset_token'
);
```

### مستندات API

- [مستندات Email.ir](https://email.ir/documentation)
- [راهنمای API](https://docs.email.ir/)

### سایر سرویس‌های ایمیل ایرانی (جایگزین‌ها)

1. **پارس‌گرین** - [parsgreen.com](https://parsgreen.com/)
2. **ایمیل سرویس** - [emailservice.ir](https://emailservice.ir/)
3. **آسان‌پرداخت** (ارسال ایمیل) - [asanpardakht.ir](https://asanpardakht.ir/)

## 3. معماری Backend

### ساختار API Backend

برای استفاده کامل از این سرویس‌ها، نیاز به یک backend API دارید که:

```
/api/auth/register/phone/send-otp   - ارسال کد OTP به شماره موبایل
/api/auth/register/verify           - تایید کد OTP و ثبت‌نام
/api/auth/login                      - ورود به سیستم
/api/auth/logout                     - خروج از سیستم
/api/auth/me                         - دریافت اطلاعات کاربر
/api/auth/refresh                    - بازیابی توکن
```

### نمونه Backend با Node.js/Express

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const farazSMS = require('../services/farazsms');
const emailIr = require('../services/emailir');

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
router.post('/register/phone/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Validate phone number
    if (!/^09\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'شماره موبایل نامعتبر است'
      });
    }
    
    // Generate and store OTP
    const otp = generateOTP();
    await redis.setex(`otp:${phone}`, 300, otp); // 5 minutes
    
    // Send SMS
    await farazSMS.sendOTP(phone, otp);
    
    res.json({
      success: true,
      message: 'کد تایید ارسال شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال کد'
    });
  }
});

// Verify OTP and Register
router.post('/register/verify', async (req, res) => {
  try {
    const { phone, otp, username, password } = req.body;
    
    // Verify OTP
    const storedOTP = await redis.get(`otp:${phone}`);
    if (storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'کد تایید نامعتبر است'
      });
    }
    
    // Create user
    const user = await User.create({
      phone,
      username,
      password: await bcrypt.hash(password, 10)
    });
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    // Delete OTP
    await redis.del(`otp:${phone}`);
    
    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت‌نام'
    });
  }
});

module.exports = router;
```

## 4. تست سرویس‌ها

### تست FarazSMS

```bash
curl -X POST https://api.farazsms.com/v2/sms/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "09123456789",
    "message": "تست ارسال پیامک",
    "sender": "1000000000"
  }'
```

### تست Email.ir

```bash
curl -X POST https://api.email.ir/v1/email/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": {
      "email": "noreply@vteemo.com",
      "name": "ویتیمو"
    },
    "to": [{"email": "test@example.com"}],
    "subject": "تست ارسال ایمیل",
    "text": "این یک پیام تست است"
  }'
```

## 5. هزینه‌ها و محدودیت‌ها

### FarazSMS
- هزینه هر پیامک: حدود 50-100 تومان
- محدودیت: بسته به پلن خریداری شده
- سرعت ارسال: فوری (کمتر از 1 ثانیه)

### Email.ir
- پلن رایگان: 1000 ایمیل در ماه
- پلن پایه: 10000 ایمیل در ماه
- محدودیت: حداکثر 10 ایمیل در ثانیه

## 6. نکات امنیتی

1. **محافظت از API Key**: هرگز API Key را در کد frontend قرار ندهید
2. **Rate Limiting**: محدود کردن تعداد درخواست OTP به 3 بار در 5 دقیقه
3. **انقضای OTP**: کد OTP باید حداکثر 5 دقیقه اعتبار داشته باشد
4. **تایید شماره**: قبل از ارسال OTP، شماره را validate کنید
5. **لاگ‌گیری**: تمام ارسال‌های پیامک و ایمیل را لاگ کنید

## 7. عیب‌یابی

### مشکل: پیامک ارسال نمی‌شود
- بررسی اعتبار حساب
- بررسی صحت API Key
- بررسی فرمت شماره موبایل
- بررسی لاگ‌های سرویس

### مشکل: ایمیل در اسپم قرار می‌گیرد
- تایید رکوردهای DNS (SPF, DKIM, DMARC)
- استفاده از محتوای مناسب
- پرهیز از کلمات اسپم
- Warm-up کردن دامنه ایمیل

## 8. پشتیبانی

- FarazSMS: support@farazsms.com
- Email.ir: support@email.ir
- Telegram کانال پشتیبانی: @vteemo_support
