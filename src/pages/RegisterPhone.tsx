/**
 * صفحه ثبت‌نام با شماره موبایل (Phone Registration)
 * 
 * این صفحه به کاربران اجازه می‌دهد با استفاده از شماره موبایل در پلتفرم ویتیمو ثبت‌نام کنند.
 * 
 * فرآیند ثبت‌نام دو مرحله‌ای:
 * 
 * مرحله اول - ارسال کد تایید:
 * 1. کاربر شماره موبایل خود را وارد می‌کند
 * 2. سیستم شماره را اعتبارسنجی می‌کند (فرمت ایرانی: 09xxxxxxxxx)
 * 3. یک کد 6 رقمی از طریق پیامک ارسال می‌شود
 * 
 * مرحله دوم - تکمیل ثبت‌نام:
 * 1. کاربر کد 6 رقمی دریافتی را وارد می‌کند
 * 2. نام کاربری و رمز عبور را تعیین می‌کند
 * 3. در صورت صحت کد، حساب کاربری ایجاد می‌شود
 * 
 * ویژگی‌های این صفحه:
 * - طراحی کاملاً رسپانسیو
 * - اعتبارسنجی شماره موبایل ایرانی
 * - ورودی خودکار کد OTP با focus اتوماتیک
 * - امکان بازگشت و تغییر شماره
 * - نمایش پیام‌های خطا به زبان فارسی
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPhone: React.FC = () => {
  // هوک‌های React Router برای مسیریابی
  const navigate = useNavigate();
  
  // دریافت تابع login از Context احراز هویت
  const { login } = useAuth();
  
  // وضعیت مرحله فعلی: 'phone' برای ورود شماره، 'otp' برای تایید کد
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // شماره موبایل وارد شده توسط کاربر
  const [phone, setPhone] = useState('');
  
  // آرایه 6 عنصری برای نگهداری کد OTP (هر عنصر یک رقم)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // نام کاربری که کاربر انتخاب می‌کند
  const [username, setUsername] = useState('');
  
  // رمز عبور حساب کاربری
  const [password, setPassword] = useState('');
  
  // وضعیت نمایش/مخفی کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);
  
  // پیام خطا در صورت بروز مشکل
  const [error, setError] = useState('');
  
  // وضعیت بارگذاری برای نمایش لودر
  const [loading, setLoading] = useState(false);

  /**
   * تابع ارسال کد OTP به شماره موبایل
   * 
   * این تابع مسئول ارسال درخواست به سرور برای ارسال پیامک حاوی کد تایید است.
   * 
   * مراحل:
   * 1. اعتبارسنجی فرمت شماره موبایل ایرانی
   * 2. ارسال درخواست به API
   * 3. در صورت موفقیت، انتقال به مرحله وارد کردن کد
   * 
   * ⚠️ نکته مهم برای توسعه‌دهنده:
   * در زمان استقرار نهایی، باید API سرویس پیامک را در اینجا تنظیم کنید
   */
  const sendOTP = async (e: React.FormEvent) => {
    // جلوگیری از رفتار پیش‌فرض فرم
    e.preventDefault();
    setError('');
    
    // اعتبارسنجی فرمت شماره موبایل ایرانی
    // شماره باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)
    if (!/^09\d{9}$/.test(phone)) {
      setError('شماره موبایل باید با 09 شروع شود و 11 رقم باشد');
      return;
    }

    // فعال کردن وضعیت بارگذاری
    setLoading(true);
    
    try {
      // ═══════════════════════════════════════════════════════════
      // 🔔 توجه: محل قرارگیری API سرویس پیامک
      // ═══════════════════════════════════════════════════════════
      // 
      // در این قسمت باید API سرویس پیامک خود را پیکربندی کنید.
      // 
      // سرویس‌های پیشنهادی ایرانی:
      // - کاوه‌نگار: https://www.kavenegar.com
      // - ملی‌پیامک: https://www.melipayamak.com
      // - اس‌ام‌اس.ir: https://www.sms.ir
      // 
      // مثال استفاده از API کاوه‌نگار:
      // const apiKey = 'YOUR_KAVENEGAR_API_KEY';
      // const smsUrl = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;
      // const response = await fetch(smsUrl, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     receptor: phone,
      //     token: otpCode, // کد تایید تصادفی 6 رقمی
      //     template: 'verify' // نام الگوی پیامک در پنل کاوه‌نگار
      //   })
      // });
      // 
      // ═══════════════════════════════════════════════════════════
      
      const response = await fetch('https://api.vteemo.com/api/auth/register/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      
      // در صورت موفقیت، انتقال به مرحله بعد (وارد کردن کد)
      if (data.success) {
        setStep('otp');
      } else {
        setError(data.message || 'خطا در ارسال کد');
      }
    } catch (err) {
      // مدیریت خطای ارتباط با سرور
      setError('خطا در اتصال به سرور');
    } finally {
      // غیرفعال کردن وضعیت بارگذاری
      setLoading(false);
    }
  };

  /**
   * تابع تایید کد OTP و تکمیل ثبت‌نام
   * 
   * این تابع کد وارد شده توسط کاربر را بررسی کرده و در صورت صحت،
   * حساب کاربری را ایجاد می‌کند.
   * 
   * اعتبارسنجی‌های انجام شده:
   * - کد OTP باید 6 رقم باشد
   * - نام کاربری حداقل 3 کاراکتر
   * - رمز عبور حداقل 6 کاراکتر
   */
  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // تبدیل آرایه OTP به یک رشته 6 رقمی
    const otpCode = otp.join('');
    
    // بررسی طول کد تایید
    if (otpCode.length !== 6) {
      setError('کد تایید باید 6 رقم باشد');
      return;
    }

    // بررسی نام کاربری
    if (!username || username.length < 3) {
      setError('نام کاربری باید حداقل 3 کاراکتر باشد');
      return;
    }

    // بررسی رمز عبور
    if (!password || password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    setLoading(true);
    try {
      // ارسال درخواست تایید کد و ثبت‌نام به سرور
      const response = await fetch('https://api.vteemo.com/api/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'phone',     // نوع ثبت‌نام: موبایل
          phone,             // شماره موبایل
          otp: otpCode,      // کد تایید 6 رقمی
          username,          // نام کاربری انتخابی
          password           // رمز عبور
        })
      });
      const data = await response.json();
      
      // در صورت موفقیت
      if (data.success && data.data.token) {
        // ذخیره توکن احراز هویت در localStorage
        localStorage.setItem('token', data.data.token);
        
        // ورود خودکار با اطلاعات جدید
        await login(username, password);
        
        // هدایت به صفحه اصلی
        navigate('/');
      } else {
        setError(data.message || 'کد نامعتبر است');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تابع مدیریت تغییرات در فیلدهای OTP
   * 
   * این تابع برای هر فیلد کد OTP فراخوانی می‌شود و:
   * - فقط اعداد را قبول می‌کند
   * - به صورت خودکار به فیلد بعدی می‌رود
   * - از ورود بیش از یک کاراکتر جلوگیری می‌کند
   */
  const handleOTPChange = (index: number, value: string) => {
    // جلوگیری از ورود بیش از یک کاراکتر
    if (value.length > 1) return;
    
    // فقط اعداد مجاز هستند
    if (value && !/^\d$/.test(value)) return;

    // به‌روزرسانی آرایه OTP
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // انتقال خودکار به فیلد بعدی
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /**
   * تابع مدیریت کلید Backspace در فیلدهای OTP
   * 
   * اگر فیلد خالی باشد و کاربر Backspace بزند،
   * به فیلد قبلی برگردد
   */
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    // کانتینر اصلی با پس‌زمینه گرادیانت و طراحی رسپانسیو
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gold-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      
      {/* کانتینر فرم با حداکثر عرض medium */}
      <div className="max-w-md w-full">
        
        {/* هدر صفحه - لوگو و نام برند */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* لوگوی ویتیمو - سایز رسپانسیو */}
            <img 
              src="/logo.svg" 
              alt="Vteemo Logo" 
              className="w-14 h-14 md:w-16 md:h-16"
            />
            <div>
              {/* نام برند با افکت گرادیانت */}
              <h1 className="text-4xl font-bold bg-gradient-vitimo bg-clip-text text-transparent">
                ویتیمو
              </h1>
              <p className="text-gold-600 font-bold">Premium Video Platform</p>
            </div>
          </div>
        </div>

        {/* 
          کارت اصلی فرم
          با افکت شیشه‌ای و سایه برای ظاهر مدرن
        */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* هدر فرم - آیکون و توضیحات */}
          <div className="text-center mb-8">
            {/* آیکون دایره‌ای تلفن */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-vitimo rounded-full mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            
            {/* 
              عنوان فرم - متن بسته به مرحله فعلی تغییر می‌کند
              مرحله اول: "ثبت‌نام با شماره موبایل"
              مرحله دوم: "تایید کد"
            */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'phone' ? 'ثبت‌نام با شماره موبایل' : 'تایید کد'}
            </h3>
            
            {/* توضیحات فرم - راهنمای کاربر */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {step === 'phone' 
                ? 'شماره موبایل خود را وارد کنید' 
                : `کد 6 رقمی ارسال شده به ${phone} را وارد کنید`}
            </p>
          </div>

          {/* نمایش پیام خطا در صورت بروز مشکل */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* 
            نمایش فرم بسته به مرحله فعلی
            مرحله اول (phone): فرم وارد کردن شماره موبایل
            مرحله دوم (otp): فرم وارد کردن کد تایید و اطلاعات حساب
          */}
          {step === 'phone' ? (
            // ══════════════════════════════════════
            // مرحله اول: ورود شماره موبایل
            // ══════════════════════════════════════
            <form onSubmit={sendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  شماره موبایل
                </label>
                {/* 
                  فیلد شماره موبایل
                  - فرمت ایرانی: 09xxxxxxxxx
                  - حداکثر 11 رقم
                  - جهت چپ به راست برای اعداد
                */}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all text-base"
                  dir="ltr"
                />
              </div>

              {/* دکمه ارسال کد تایید */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-vitimo text-white font-bold py-3 sm:py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
              </button>
            </form>
          ) : (
            // ══════════════════════════════════════
            // مرحله دوم: تایید کد و تکمیل ثبت‌نام
            // ══════════════════════════════════════
            <form onSubmit={verifyOTP} className="space-y-5">
              {/* 
                بخش وارد کردن کد OTP
                6 فیلد مجزا برای هر رقم کد
              */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  کد تایید 6 رقمی
                </label>
                {/* 
                  کانتینر فیلدهای OTP
                  - در موبایل: فاصله کمتر بین فیلدها
                  - انتقال خودکار به فیلد بعدی
                */}
                <div className="flex gap-1.5 sm:gap-2 justify-center" dir="ltr">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric" // صفحه‌کلید عددی در موبایل
                      maxLength={1} // فقط یک کاراکتر
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* فیلد نام کاربری */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all text-base"
                />
              </div>

              {/* 
                فیلد رمز عبور
                با قابلیت نمایش/مخفی کردن
              */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all pr-12 text-base"
                  />
                  {/* دکمه نمایش/مخفی کردن رمز */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* دکمه تایید و ثبت‌نام */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-vitimo text-white font-bold py-3 sm:py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>

              {/* 
                دکمه بازگشت
                امکان تغییر شماره موبایل و بازگشت به مرحله اول
              */}
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full flex items-center justify-center gap-2 text-vitimo-600 dark:text-vitimo-400 hover:underline text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت و تغییر شماره</span>
              </button>
            </form>
          )}

          {/* 
            لینک ورود
            برای کاربرانی که قبلاً ثبت‌نام کرده‌اند
          */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>

        {/* متن قوانین و شرایط */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          با ثبت‌نام، شما با{' '}
          <a href="#" className="text-vitimo-600 dark:text-vitimo-400 hover:underline">
            شرایط و قوانین
          </a>{' '}
          ما موافقت می‌کنید
        </div>
      </div>
    </div>
  );
};

// صادرات کامپوننت برای استفاده در سایر قسمت‌های برنامه
export default RegisterPhone;
