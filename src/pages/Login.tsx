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
      {/* Wave pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50 L 100 100 L 0 100 Z' fill='%23ffffff' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2">
          {/* Right column (in RTL): Brand + title + features */}
          <div className="text-right lg:order-2">
            <BrandHeader />
            <div className="mt-8">
              <FeatureGrid />
            </div>
          </div>

          {/* Left column (in RTL): Login form */}
          <div className="lg:order-1">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login