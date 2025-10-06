/** 
 * @file Login.tsx
 * @description Landing/login page: brand header, feature grid, and authentication form.
 * Dark gradient background with a subtle decorative image. RTL layout and responsive.
 */
import React from 'react'
import BrandHeader from '../components/auth/BrandHeader'
import FeatureGrid from '../components/auth/FeatureGrid'
import AuthForm from '../components/auth/AuthForm'

/**
 * @component Login
 * @description Assembles the full page with a two-column layout (left: form, right: brand + features).
 */
const Login: React.FC = () => {
  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-[#3c0f63] to-[#0f1024]"
        aria-hidden="true"
      />
      {/* Decorative low-opacity background image */}
      <img
        src="https://pub-cdn.sider.ai/u/U0GVH7NRL9J/web-coder/68e3eb13b54d8be52ab4d746/resource/4f819288-bb13-4033-a5f7-bdc25ecd4933.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-32 -bottom-40 w-[800px] opacity-10 rotate-12"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2">
          {/* Left column: Login form */}
          <div>
            <AuthForm />
          </div>

          {/* Right column: Brand + title + features */}
          <div className="text-right">
            <BrandHeader />
            <div className="mt-8">
              <FeatureGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login