/** 
 * @file AuthForm.tsx
 * @description User login form with password show/hide, error message, and helper links.
 */
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * @component AuthForm
 * @description Card-styled login form with high-contrast dark UI.
 */
export default function AuthForm(): JSX.Element {
  const navigate = useNavigate()
  const { login, error: authError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * @function handleSubmit
   * @description Submit handler that calls the actual login from AuthContext.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const success = await login(email, password)
    
    if (success) {
      navigate('/')
    } else {
      setError(authError || 'ایمیل یا رمز عبور نادرست است.')
    }
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">ورود به ویتیمو</h3>
        <p className="text-white/70 text-sm">وارد حساب کاربری خود شوید</p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
            ایمیل
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@vitimo.com"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
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
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="button"
              aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3 font-bold text-black shadow-[0_8px_24px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-400 hover:shadow-[0_10px_28px_rgba(245,158,11,0.45)] disabled:opacity-60"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>

      {/* Links */}
      <div className="mt-5 space-y-2 text-center">
        <button className="text-amber-300 hover:text-amber-200 text-sm font-medium">فراموشی رمز عبور</button>
        <p className="text-white/70 text-sm">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="text-amber-300 hover:text-amber-200 font-semibold">
            ثبت نام کنید
          </Link>
        </p>
      </div>
    </div>
  )
}
