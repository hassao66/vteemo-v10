import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, CheckCircle, Film, Image as ImageIcon, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { videosAPI } from '../services/supabase-api';
import { StorageService } from '../services/storage';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'آموزشی',
    tags: ''
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'video' | 'thumbnail' | 'saving'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت فایل پشتیبانی نمی‌شود. فقط فایل‌های MP4, WebM, MOV, AVI, MKV مجاز هستند.');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم فایل نباید بیشتر از 500 مگابایت باشد.');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت تصویر پشتیبانی نمی‌شود. فقط JPG, PNG, WebP مجاز هستند.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم تصویر نباید بیشتر از 5 مگابایت باشد.');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!videoFile) {
      setError('لطفاً یک فایل ویدیو انتخاب کنید.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload video file
      setUploadStatus('video');
      setUploadProgress(10);
      const videoResult = await StorageService.uploadVideo(videoFile, user!.id);

      if (!videoResult.success) {
        setError(videoResult.error || 'خطا در آپلود ویدیو');
        setIsUploading(false);
        return;
      }

      setUploadProgress(50);

      // Upload thumbnail if provided
      let thumbnailUrl = 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800';
      if (thumbnailFile) {
        setUploadStatus('thumbnail');
        const thumbnailResult = await StorageService.uploadThumbnail(thumbnailFile, user!.id);
        if (thumbnailResult.success && thumbnailResult.url) {
          thumbnailUrl = thumbnailResult.url;
        }
      }

      setUploadProgress(75);

      // Get video duration
      const duration = await StorageService.getVideoDuration(videoFile);

      // Save video metadata to database
      setUploadStatus('saving');
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      await videosAPI.uploadVideo({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        thumbnail_url: thumbnailUrl,
        video_url: videoResult.url!,
        duration: duration
      });

      setUploadProgress(100);
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('خطای غیرمنتظره در آپلود. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsUploading(false);
      setUploadStatus('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getUploadStatusText = () => {
    switch (uploadStatus) {
      case 'video':
        return 'در حال آپلود ویدیو...';
      case 'thumbnail':
        return 'در حال آپلود تصویر...';
      case 'saving':
        return 'در حال ذخیره اطلاعات...';
      default:
        return 'در حال پردازش...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">آپلود ویدیو</h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 ml-3" />
            <span>ویدیو با موفقیت آپلود شد! در حال انتقال به صفحه اصلی...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isUploading && (
          <div className="bg-blue-500/20 border border-blue-500 text-blue-400 px-6 py-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Loader className="w-5 h-5 animate-spin ml-3" />
                <span>{getUploadStatusText()}</span>
              </div>
              <span className="font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              فایل ویدیو *
            </label>
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 hover:border-red-500 rounded-lg p-12 text-center cursor-pointer transition-colors"
            >
              {videoPreview ? (
                <div className="space-y-4">
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <div className="text-white">
                    <p className="font-medium">{videoFile?.name}</p>
                    <p className="text-sm text-gray-400">
                      {videoFile && StorageService.formatFileSize(videoFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoFile(null);
                      setVideoPreview('');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    حذف ویدیو
                  </button>
                </div>
              ) : (
                <>
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    فایل ویدیو را انتخاب کنید
                  </h3>
                  <p className="text-gray-400 mb-4">یا فایل را بکشید و اینجا رها کنید</p>
                  <div className="text-sm text-gray-500">
                    <p>فرمت‌های مجاز: MP4, WebM, MOV, AVI, MKV</p>
                    <p>حداکثر حجم: 500 مگابایت</p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>

          {/* Thumbnail Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              تصویر بندانگشتی (اختیاری)
            </label>
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 hover:border-red-500 rounded-lg p-8 text-center cursor-pointer transition-colors"
            >
              {thumbnailPreview ? (
                <div className="space-y-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <div className="text-white">
                    <p className="font-medium">{thumbnailFile?.name}</p>
                    <p className="text-sm text-gray-400">
                      {thumbnailFile && StorageService.formatFileSize(thumbnailFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    حذف تصویر
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">تصویر بندانگشتی</h3>
                  <p className="text-gray-400 text-sm mb-2">کلیک کنید یا فایل را بکشید</p>
                  <div className="text-xs text-gray-500">
                    <p>فرمت‌های مجاز: JPG, PNG, WebP | حداکثر: 5MB</p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                عنوان *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isUploading}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
                placeholder="عنوان ویدیو را وارد کنید"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                دسته‌بندی *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isUploading}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
              >
                <option value="آموزشی">آموزشی</option>
                <option value="سرگرمی">سرگرمی</option>
                <option value="موسیقی">موسیقی</option>
                <option value="ورزشی">ورزشی</option>
                <option value="خبری">خبری</option>
                <option value="فناوری">فناوری</option>
                <option value="بازی">بازی</option>
                <option value="فیلم">فیلم</option>
                <option value="هنری">هنری</option>
                <option value="طبیعت">طبیعت</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
              placeholder="درباره ویدیوی خود توضیح دهید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              برچسب‌ها (با کاما جدا کنید)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
              placeholder="آموزش، برنامه‌نویسی، react"
            />
          </div>

          <div className="flex justify-end space-x-4 gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isUploading}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={isUploading || !videoFile}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  در حال آپلود...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  آپلود ویدیو
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
