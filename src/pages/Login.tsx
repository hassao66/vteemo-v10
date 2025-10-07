/**
 * صفحه ورود به سیستم (Login Page)
 * 
 * این صفحه اصلی‌ترین نقطه ورود کاربران به پلتفرم ویتیمو است.
 * کاربران می‌توانند با ایمیل یا شماره موبایل خود وارد شوند.
 * 
 * ویژگی‌های این صفحه:
 * - پس‌زمینه گرادیانت زیبا با افکت موج
 * - چیدمان دو ستونی: فرم ورود در سمت چپ و اطلاعات برند در سمت راست
 * - طراحی کاملاً رسپانسیو برای موبایل، تبلت و دسکتاپ
 * - پشتیبانی کامل از زبان فارسی (راست‌چین - RTL)
 */
import React from 'react'
import BrandHeader from '../components/auth/BrandHeader'
import FeatureGrid from '../components/auth/FeatureGrid'
import AuthForm from '../components/auth/AuthForm'

/**
 * کامپوننت اصلی صفحه ورود
 * 
 * این کامپوننت سه بخش اصلی را کنار هم قرار می‌دهد:
 * 1. BrandHeader: هدر برند با لوگو و شعار
 * 2. FeatureGrid: نمایش ویژگی‌های پلتفرم
 * 3. AuthForm: فرم ورود کاربر
 */
const Login: React.FC = () => {
  return (
    // کانتینر اصلی با جهت راست به چپ (RTL) برای زبان فارسی
    <div dir="rtl" className="relative min-h-screen overflow-hidden">
      
      {/* 
        پس‌زمینه گرادیانت رنگی
        از رنگ‌های بنفش تیره استفاده می‌کند تا ظاهری حرفه‌ای و مدرن داشته باشد
      */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-[#3c0f63] to-[#0f1024]"
        aria-hidden="true"
      />
      
      {/* 
        افکت موج در پس‌زمینه
        یک الگوی موج ظریف که حس عمق و زیبایی به صفحه می‌دهد
      */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50 L 100 100 L 0 100 Z' fill='%23ffffff' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />

      {/* 
        محتوای اصلی صفحه
        با استفاده از grid system برای چیدمان رسپانسیو
      */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-14">
        
        {/* 
          شبکه دو ستونی (Grid Layout)
          - در موبایل: یک ستون (عمودی)
          - در دسکتاپ: دو ستون (افقی)
        */}
        <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2">
          
          {/* 
            ستون راست (در RTL): نمایش برند و ویژگی‌ها
            order-2 در دسکتاپ این بخش را در سمت راست قرار می‌دهد
          */}
          <div className="text-right lg:order-2">
            {/* هدر برند با لوگو و توضیحات */}
            <BrandHeader />
            
            {/* شبکه ویژگی‌های پلتفرم */}
            <div className="mt-8">
              <FeatureGrid />
            </div>
          </div>

          {/* 
            ستون چپ (در RTL): فرم ورود به سیستم
            order-1 در دسکتاپ این بخش را در سمت چپ قرار می‌دهد
          */}
          <div className="lg:order-1">
            {/* 
              فرم احراز هویت
              کاربر می‌تواند با ایمیل یا شماره موبایل وارد شود
            */}
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}

// صادرات کامپوننت برای استفاده در سایر قسمت‌های برنامه
export default Login