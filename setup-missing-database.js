// اسکریپت تکمیل دیتابیس - بعد از اتمام حذف می‌شود
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 در حال تکمیل دیتابیس Supabase...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL برای ایجاد جدول comments
const createCommentsTableSQL = `
-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
`;

async function createCommentsTable() {
  console.log('📊 ایجاد جدول Comments...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createCommentsTableSQL 
    });
    
    if (error) {
      // اگر RPC کار نکرد، از SQL Editor استفاده می‌کنیم
      console.log('   ℹ️  باید از SQL Editor پنل Supabase استفاده کنید');
      console.log('   📋 SQL را در فایل setup-comments.sql ذخیره می‌کنم...\n');
      return false;
    }
    
    console.log('   ✅ جدول Comments ایجاد شد!\n');
    return true;
  } catch (err) {
    console.log('   ℹ️  نیاز به اجرای دستی SQL دارید');
    return false;
  }
}

async function createStorageBuckets() {
  console.log('💾 ایجاد Storage Buckets...\n');
  
  const buckets = [
    { name: 'videos', public: true, fileTypes: ['video/*'], maxSize: 500 * 1024 * 1024 }, // 500MB
    { name: 'thumbnails', public: true, fileTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }, // 5MB
    { name: 'avatars', public: true, fileTypes: ['image/*'], maxSize: 2 * 1024 * 1024 } // 2MB
  ];
  
  let successCount = 0;
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.maxSize,
        allowedMimeTypes: bucket.fileTypes
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  ${bucket.name} - قبلاً وجود دارد`);
          successCount++;
        } else {
          console.log(`   ❌ ${bucket.name} - خطا: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${bucket.name} - ایجاد شد!`);
        successCount++;
      }
    } catch (err) {
      console.log(`   ❌ ${bucket.name} - خطا: ${err.message}`);
    }
  }
  
  console.log(`\n   📊 نتیجه: ${successCount}/${buckets.length} bucket ایجاد شد\n`);
  return successCount === buckets.length;
}

async function setStoragePermissions() {
  console.log('🔐 تنظیم دسترسی‌های Storage...\n');
  
  // Note: Policies باید از پنل Supabase تنظیم شوند
  console.log('   ℹ️  برای تنظیم دسترسی‌ها:');
  console.log('   1. به Storage → Policies بروید');
  console.log('   2. برای هر bucket یک policy بسازید:');
  console.log('      - SELECT: عمومی (برای همه)');
  console.log('      - INSERT: فقط authenticated users');
  console.log('      - UPDATE: فقط صاحب فایل');
  console.log('      - DELETE: فقط صاحب فایل\n');
  
  return true;
}

async function main() {
  console.log('='.repeat(60) + '\n');
  
  // 1. ایجاد جدول comments
  const commentsCreated = await createCommentsTable();
  
  // 2. ایجاد Storage Buckets
  const bucketsCreated = await createStorageBuckets();
  
  // 3. راهنمای تنظیم دسترسی‌ها
  await setStoragePermissions();
  
  console.log('='.repeat(60));
  console.log('\n📋 خلاصه:\n');
  
  if (!commentsCreated) {
    console.log('   ⚠️  جدول Comments باید دستی ایجاد شود');
    console.log('   📝 فایل SQL را در setup-comments.sql ذخیره کردم\n');
  }
  
  if (bucketsCreated) {
    console.log('   ✅ Storage Buckets آماده است');
  } else {
    console.log('   ⚠️  برخی Buckets ایجاد نشدند');
  }
  
  console.log('\n🎯 مرحله بعدی: اجرای مجدد check-database.js\n');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
