// اسکریپت بررسی دیتابیس Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 در حال بررسی دیتابیس Supabase...\n');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey ? '✅ موجود است' : '❌ موجود نیست');
console.log('\n' + '='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطا: متغیرهای محیطی تنظیم نشده‌اند!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// لیست جداول مورد نیاز
const requiredTables = [
  'profiles',
  'videos',
  'live_streams',
  'wallets',
  'transactions',
  'comments',
  'subscriptions'
];

// لیست Storage Buckets مورد نیاز
const requiredBuckets = [
  'videos',
  'thumbnails',
  'avatars'
];

async function checkTables() {
  console.log('📊 بررسی جداول (Tables):\n');
  
  const results = {
    existing: [],
    missing: []
  };

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.log(`   ❌ ${table} - وجود ندارد`);
          results.missing.push(table);
        } else {
          console.log(`   ⚠️  ${table} - خطا: ${error.message}`);
          results.missing.push(table);
        }
      } else {
        const count = data ? data.length : 0;
        console.log(`   ✅ ${table} - موجود است (${count} ردیف نمونه)`);
        results.existing.push(table);
      }
    } catch (err) {
      console.log(`   ❌ ${table} - خطای غیرمنتظره: ${err.message}`);
      results.missing.push(table);
    }
  }

  return results;
}

async function checkStorageBuckets() {
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('💾 بررسی Storage Buckets:\n');
  
  const results = {
    existing: [],
    missing: []
  };

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`   ❌ خطا در دریافت لیست buckets: ${error.message}\n`);
      return results;
    }

    const bucketNames = buckets.map(b => b.name);

    for (const bucket of requiredBuckets) {
      if (bucketNames.includes(bucket)) {
        const bucketInfo = buckets.find(b => b.name === bucket);
        console.log(`   ✅ ${bucket} - موجود است (${bucketInfo.public ? 'عمومی' : 'خصوصی'})`);
        results.existing.push(bucket);
      } else {
        console.log(`   ❌ ${bucket} - وجود ندارد`);
        results.missing.push(bucket);
      }
    }

    // نمایش buckets اضافی
    const extraBuckets = bucketNames.filter(name => !requiredBuckets.includes(name));
    if (extraBuckets.length > 0) {
      console.log(`\n   ℹ️  Buckets اضافی: ${extraBuckets.join(', ')}`);
    }

  } catch (err) {
    console.log(`   ❌ خطای غیرمنتظره: ${err.message}\n`);
  }

  return results;
}

async function checkAuth() {
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🔐 بررسی Authentication:\n');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`   ⚠️  خطا: ${error.message}`);
    } else {
      console.log(`   ✅ سیستم احراز هویت فعال است`);
    }
  } catch (err) {
    console.log(`   ❌ خطا: ${err.message}`);
  }
}

async function generateReport(tablesResult, bucketsResult) {
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('📋 گزارش نهایی:\n');
  
  const totalTables = requiredTables.length;
  const existingTables = tablesResult.existing.length;
  const totalBuckets = requiredBuckets.length;
  const existingBuckets = bucketsResult.existing.length;
  
  console.log(`   📊 جداول: ${existingTables}/${totalTables} موجود است`);
  console.log(`   💾 Storage: ${existingBuckets}/${totalBuckets} موجود است`);
  
  const readyPercentage = Math.round(
    ((existingTables + existingBuckets) / (totalTables + totalBuckets)) * 100
  );
  
  console.log(`\n   🎯 آمادگی دیتابیس: ${readyPercentage}%\n`);
  
  if (tablesResult.missing.length > 0) {
    console.log('   ❌ جداول ناقص:');
    tablesResult.missing.forEach(table => {
      console.log(`      - ${table}`);
    });
    console.log('');
  }
  
  if (bucketsResult.missing.length > 0) {
    console.log('   ❌ Storage Buckets ناقص:');
    bucketsResult.missing.forEach(bucket => {
      console.log(`      - ${bucket}`);
    });
    console.log('');
  }
  
  if (readyPercentage === 100) {
    console.log('   ✅ دیتابیس کاملاً آماده است! می‌توانید دیپلوی کنید. 🚀\n');
  } else if (readyPercentage >= 70) {
    console.log('   ⚠️  دیتابیس تقریباً آماده است. برخی جداول یا buckets ناقص هستند.\n');
  } else {
    console.log('   ❌ دیتابیس آماده نیست. باید جداول و buckets را ایجاد کنید.\n');
  }
  
  console.log('='.repeat(60) + '\n');
}

async function main() {
  try {
    const tablesResult = await checkTables();
    const bucketsResult = await checkStorageBuckets();
    await checkAuth();
    await generateReport(tablesResult, bucketsResult);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ خطای کلی:', error.message);
    process.exit(1);
  }
}

main();
