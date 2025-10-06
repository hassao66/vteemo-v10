import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPhone: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate Iranian phone number
    if (!/^09\d{9}$/.test(phone)) {
      setError('شماره موبایل باید با 09 شروع شود و 11 رقم باشد');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.vteemo.com/api/auth/register/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      
      if (data.success) {
        setStep('otp');
      } else {
        setError(data.message || 'خطا در ارسال کد');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('کد تایید باید 6 رقم باشد');
      return;
    }

    if (!username || username.length < 3) {
      setError('نام کاربری باید حداقل 3 کاراکتر باشد');
      return;
    }

    if (!password || password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.vteemo.com/api/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'phone',
          phone,
          otp: otpCode,
          username,
          password
        })
      });
      const data = await response.json();
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        // Try to login with the new credentials
        await login(username, password);
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

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gold-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/logo.svg" 
              alt="Vteemo Logo" 
              className="w-14 h-14 md:w-16 md:h-16"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-vitimo bg-clip-text text-transparent">
                ویتیمو
              </h1>
              <p className="text-gold-600 font-bold">Premium Video Platform</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-vitimo rounded-full mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'phone' ? 'ثبت‌نام با شماره موبایل' : 'تایید کد'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'phone' 
                ? 'شماره موبایل خود را وارد کنید' 
                : `کد 6 رقمی ارسال شده به ${phone} را وارد کنید`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={sendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-vitimo text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  کد تایید 6 رقمی
                </label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                    />
                  ))}
                </div>
              </div>

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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                />
              </div>

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
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-vitimo text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full flex items-center justify-center space-x-2 text-vitimo-600 dark:text-vitimo-400 hover:underline text-sm font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت و تغییر شماره</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>

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

export default RegisterPhone;
