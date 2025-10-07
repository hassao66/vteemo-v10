/**
 * صفحه ثبت‌نام با ایمیل (Email Registration)
 * 
 * این صفحه به کاربران اجازه می‌دهد با استفاده از ایمیل در پلتفرم ویتیمو ثبت‌نام کنند.
 * 
 * فرآیند ثبت‌نام:
 * 1. کاربر نام کاربری، ایمیل و رمز عبور خود را وارد می‌کند
 * 2. سیستم اعتبارسنجی انجام می‌دهد (طول رمز عبور، تطابق رمزها و...)
 * 3. در صورت موفقیت، اطلاعات کاربر در دیتابیس ذخیره می‌شود
 * 4. کاربر به صفحه اصلی هدایت می‌شود
 * 
 * ویژگی‌های این صفحه:
 * - طراحی کاملاً رسپانسیو
 * - اعتبارسنجی فرم در سمت کلاینت
 * - نمایش پیام‌های خطا به زبان فارسی
 * - امکان نمایش/مخفی کردن رمز عبور
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  // هوک‌های React Router برای مسیریابی
  const navigate = useNavigate();
  
  // دریافت تابع ثبت‌نام و خطاها از Context احراز هویت
  const { register, error: authError } = useAuth();
  
  // وضعیت نمایش/مخفی کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);
  
  // وضعیت فرم - نگهداری اطلاعات ورودی کاربر
  const [formData, setFormData] = useState({
    username: '',      // نام کاربری
    email: '',         // ایمیل کاربر
    password: '',      // رمز عبور
    confirmPassword: '' // تکرار رمز عبور برای اطمینان
  });
  
  // وضعیت خطاهای محلی (اعتبارسنجی فرم)
  const [error, setError] = useState('');
  
  // وضعیت بارگذاری - برای نمایش لودر هنگام ثبت‌نام
  const [isLoading, setIsLoading] = useState(false);

  /**
   * تابع مدیریت ارسال فرم ثبت‌نام
   * 
   * این تابع زمانی فراخوانی می‌شود که کاربر دکمه "ثبت‌نام" را بزند
   * 
   * مراحل:
   * 1. جلوگیری از رفتار پیش‌فرض فرم (بارگذاری مجدد صفحه)
   * 2. پاک کردن خطاهای قبلی
   * 3. اعتبارسنجی داده‌های ورودی
   * 4. ارسال درخواست ثبت‌نام به سرور
   * 5. هدایت کاربر در صورت موفقیت
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // جلوگیری از رفتار پیش‌فرض فرم (refresh صفحه)
    e.preventDefault();
    
    // پاک کردن پیام خطای قبلی
    setError('');

    // بررسی تطابق رمز عبور با تکرار آن
    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    // بررسی حداقل طول رمز عبور (امنیت)
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    // فعال کردن وضعیت بارگذاری (نمایش لودر)
    setIsLoading(true);

    // فراخوانی تابع ثبت‌نام از AuthContext
    // این تابع اطلاعات را به سرور ارسال می‌کند
    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    // در صورت موفقیت، هدایت به صفحه اصلی
    if (success) {
      navigate('/');
    }
    
    // غیرفعال کردن وضعیت بارگذاری
    setIsLoading(false);
  };

  /**
   * تابع مدیریت تغییرات فیلدهای فرم
   * 
   * این تابع هر بار که کاربر چیزی در فیلدهای فرم تایپ می‌کند،
   * اطلاعات را در state ذخیره می‌کند
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData, // کپی تمام فیلدهای قبلی
      [e.target.name]: e.target.value // به‌روزرسانی فقط فیلدی که تغییر کرده
    });
  };

  return (
    // کانتینر اصلی با ارتفاع کامل صفحه و پس‌زمینه گرادیانت
    // پشتیبانی از حالت روشن و تاریک با استفاده از dark:
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gold-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      
      {/* کانتینر اصلی فرم با حداکثر عرض medium - کاملاً رسپانسیو */}
      <div className="max-w-md w-full">
        
        {/* 
          بخش هدر - نمایش لوگو و نام برند
          در موبایل و تبلت و دسکتاپ به خوبی نمایش داده می‌شود
        */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* 
              لوگوی ویتیمو
              سایز متغیر بسته به اندازه صفحه (14 در موبایل، 16 در دسکتاپ)
            */}
            <img 
              src="/logo.svg" 
              alt="Vteemo Logo" 
              className="w-14 h-14 md:w-16 md:h-16"
            />
            <div>
              {/* عنوان برند با افکت گرادیانت */}
              <h1 className="text-4xl font-bold bg-gradient-vitimo bg-clip-text text-transparent">
                ویتیمو
              </h1>
              <p className="text-gold-600 font-bold">Premium Video Platform</p>
            </div>
          </div>
        </div>

        {/* 
          کارت اصلی فرم ثبت‌نام
          استفاده از افکت شیشه‌ای (glass effect) و سایه برای زیبایی بیشتر
        */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
          
          {/* هدر فرم - آیکون و توضیحات */}
          <div className="text-center mb-8">
            {/* آیکون دایره‌ای با پس‌زمینه گرادیانت */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-vitimo rounded-full mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            
            {/* عنوان فرم */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ثبت‌نام در ویتیمو
            </h3>
            
            {/* توضیحات فرم */}
            <p className="text-gray-600 dark:text-gray-400">
              حساب کاربری جدید بسازید
            </p>
          </div>

          {/* 
            نمایش پیام خطا
            در صورت بروز خطا در اعتبارسنجی یا ارتباط با سرور، پیام نمایش داده می‌شود
          */}
          {(error || authError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
              {error || authError}
            </div>
          )}

          {/* 
            فرم ثبت‌نام با ایمیل
            شامل فیلدهای: نام کاربری، ایمیل، رمز عبور و تکرار رمز عبور
          */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* فیلد نام کاربری */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نام کاربری
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required // این فیلد اجباری است
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>

            {/* 
              فیلد ایمیل
              اعتبارسنجی خودکار توسط مرورگر (type="email")
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required // این فیلد اجباری است
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                placeholder="example@vitimo.com"
              />
            </div>

            {/* 
              فیلد رمز عبور
              با قابلیت نمایش/مخفی کردن رمز
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  // نوع input بسته به وضعیت showPassword تغییر می‌کند
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required // این فیلد اجباری است
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all pr-12"
                  placeholder="حداقل ۶ کاراکتر"
                />
                {/* 
                  دکمه نمایش/مخفی کردن رمز عبور
                  با کلیک روی آیکون چشم، می‌توان رمز را دید یا مخفی کرد
                */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 
              فیلد تکرار رمز عبور
              برای اطمینان از صحت رمز عبور وارد شده
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تکرار رمز عبور
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required // این فیلد اجباری است
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                placeholder="رمز عبور را دوباره وارد کنید"
              />
            </div>

            {/* 
              دکمه ثبت‌نام
              - در حالت بارگذاری غیرفعال می‌شود
              - متن دکمه بسته به وضعیت تغییر می‌کند
              - افکت hover برای تعامل بهتر
            */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-vitimo text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          {/* 
            لینک‌های راهنما
            - لینک به صفحه ورود برای کاربران قبلی
            - لینک به ثبت‌نام با شماره موبایل
          */}
          <div className="mt-6 text-center space-y-3">
            {/* لینک ورود برای کاربران ثبت‌نام شده */}
            <p className="text-gray-600 dark:text-gray-400">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                وارد شوید
              </Link>
            </p>
            
            {/* لینک ثبت‌نام با شماره موبایل */}
            <p className="text-gray-600 dark:text-gray-400">
              <Link to="/register/phone" className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                ثبت‌نام با شماره موبایل
              </Link>
            </p>
          </div>
        </div>

        {/* 
          متن قوانین و شرایط
          نمایش توافقنامه کاربری
        */}
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
export default Register;
