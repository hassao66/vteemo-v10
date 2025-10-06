/** 
 * @file AuthForm.tsx
 * @description User login/register form with tabs and multiple login methods.
 */
import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * @component AuthForm
 * @description Card-styled auth form with tabs for Login/Register and Email/Mobile methods.
 */
export default function AuthForm(): JSX.Element {
  const navigate = useNavigate()
  const { login, error: authError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Tab states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')

  /**
   * @function handleSubmit
   * @description Submit handler that calls the actual login from AuthContext.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (authMode === 'login') {
      const loginValue = loginMethod === 'email' ? email : phone
      const success = await login(loginValue, password)
      
      if (success) {
        navigate('/')
      } else {
        setError(authError || 'اطلاعات ورود نادرست است.')
      }
    } else {
      // Register mode - redirect to register page
      navigate('/register')
    }
    setLoading(false)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
      {/* Main tabs: Login / Register */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
            authMode === 'login'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg'
              : 'text-white/70 hover:text-white'
          }`}
        >
          ورود
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
            authMode === 'register'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg'
              : 'text-white/70 hover:text-white'
          }`}
        >
          ثبت‌نام
        </button>
      </div>

      {authMode === 'login' ? (
        <>
          {/* Login method tabs: Email / Mobile */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                loginMethod === 'email'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Mail className="w-4 h-4" />
              ایمیل
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Phone className="w-4 h-4" />
              شماره موبایل
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone input */}
            <div>
              <label htmlFor="login-input" className="block mb-2 text-sm font-medium text-white">
                {loginMethod === 'email' ? 'ایمیل' : 'شماره موبایل'}
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                  {loginMethod === 'email' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                </div>
                <input
                  id="login-input"
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  required
                  value={loginMethod === 'email' ? email : phone}
                  onChange={(e) => loginMethod === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                  placeholder={loginMethod === 'email' ? 'example@vitimo.com' : '09123456789'}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-11 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-11 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-left">
              <button type="button" className="text-amber-300 hover:text-amber-200 text-sm font-medium">
                فراموشی رمز عبور؟
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.4)] transition-all hover:shadow-[0_12px_35px_rgba(245,158,11,0.5)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال ورود...' : 'ورود به ویتیمو'}
            </button>
          </form>
        </>
      ) : (
        /* Register mode */
        <div className="text-center py-12">
          <p className="text-white mb-6">برای ثبت‌نام در پلتفرم ویتیمو، به صفحه ثبت‌نام منتقل می‌شوید.</p>
          <button
            onClick={() => navigate('/register')}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.4)] transition-all hover:shadow-[0_12px_35px_rgba(245,158,11,0.5)] hover:scale-[1.02]"
          >
            رفتن به صفحه ثبت‌نام
          </button>
        </div>
      )}
    </div>
  )
}
