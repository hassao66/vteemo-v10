import { supabase } from '../lib/supabase';

export interface UploadProgress {
  progress: number;
  bytesUploaded: number;
  totalBytes: number;
}

export class StorageService {
  /**
   * Upload a video file to Supabase Storage
   */
  static async uploadVideo(
    file: File,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'فرمت فایل پشتیبانی نمی‌شود. فقط فایل‌های MP4, WebM, MOV, AVI, MKV مجاز هستند.'
        };
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'حجم فایل نباید بیشتر از 500 مگابایت باشد.'
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file
      const { error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return {
          success: false,
          error: 'خطا در آپلود فایل: ' + error.message
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl
      };
    } catch (error: unknown) {
      console.error('Upload exception:', error);
      return {
        success: false,
        error: 'خطای غیرمنتظره در آپلود فایل'
      };
    }
  }

  /**
   * Upload a thumbnail image to Supabase Storage
   */
  static async uploadThumbnail(
    file: File,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'فرمت تصویر پشتیبانی نمی‌شود. فقط JPG, PNG, WebP مجاز هستند.'
        };
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'حجم تصویر نباید بیشتر از 5 مگابایت باشد.'
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file
      const { error } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Thumbnail upload error:', error);
        return {
          success: false,
          error: 'خطا در آپلود تصویر: ' + error.message
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl
      };
    } catch (error: unknown) {
      console.error('Thumbnail upload exception:', error);
      return {
        success: false,
        error: 'خطای غیرمنتظره در آپلود تصویر'
      };
    }
  }

  /**
   * Delete a video file from storage
   */
  static async deleteVideo(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Delete a thumbnail from storage
   */
  static async deleteThumbnail(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('thumbnails')
        .remove([filePath]);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Get video duration from file
   */
  static async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };

      video.onerror = () => {
        resolve(0);
      };

      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بایت';

    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
