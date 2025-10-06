import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Eye, EyeOff, Wallet, Radio, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const { t, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    { icon: Play, text: 'پخش ویدیو با کیفیت 4K' },
    { icon: Radio, text: 'پخش زنده تعاملی' },
    { icon: Mic, text: 'پادکست‌های اختصاصی' },
    { icon: Wallet, text: 'کیف پول ریالی' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gold-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-right space-y-8">
          <div>
            <div className="flex flex-col items-center lg:items-end mb-6">
              <img 
                src="/logo.svg" 
                alt="Vteemo Logo" 
                className="w-16 h-16 md:w-20 md:h-20 mb-3"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                ویتیمو
              </h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('login.subtitle')}
            </h2>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              پلتفرم ویدیویی حرفه‌ای با امکانات پیشرفته پخش زنده، پادکست و کیف پول ریالی
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-vitimo rounded-lg">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {feature.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('login.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                وارد حساب کاربری خود شوید
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('login.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all"
                  placeholder="example@vitimo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent transition-all pr-12"
                    placeholder="رمز عبور خود را وارد کنید"
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
                disabled={isLoading}
                className="w-full bg-gradient-vitimo text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-vitimo hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'در حال ورود...' : t('login.signin')}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <button className="text-vitimo-600 dark:text-vitimo-400 hover:underline text-sm font-medium block w-full">
                {t('login.forgotPassword')}
              </button>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                حساب کاربری ندارید؟{' '}
                <Link to="/register" className="text-vitimo-600 dark:text-vitimo-400 hover:underline font-medium">
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;