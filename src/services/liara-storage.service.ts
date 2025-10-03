// src/services/liara-storage.service.ts

import { S3 } from "@aws-sdk/client-s3";

// تنظیمات کلاینت S3
const s3 = new S3({
    endpoint: "https://storage.iran.liara.space",
    region: "us-east-1", // منطقه را طبق نیاز خود تنظیم کنید
    credentials: {
        accessKeyId: "YOUR_ACCESS_KEY_ID", // کلید دسترسی را اینجا قرار دهید
        secretAccessKey: "YOUR_SECRET_ACCESS_KEY" // کلید مخفی را اینجا قرار دهید
    }
});

class LiaraStorageService {
    // بارگذاری ویدیو
    async uploadVideo(file: File, onProgress: (progress: number) => void): Promise<void> {
        const bucketName = "storage-vteemo";
        const key = "h22udm0r1aooauk6";
        
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file
        };

        try {
            const { Progress } = s3.upload(uploadParams, (progress) => {
                onProgress((progress.loaded / progress.total) * 100);
            });

            await Progress;
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    }

    // بارگذاری تصویر بندانگشتی
    async uploadThumbnail(file: File, onProgress: (progress: number) => void): Promise<void> {
        const bucketName = "thumbnails";
        const key = "2v29d1s41b60s7mc";

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file
        };

        try {
            const { Progress } = s3.upload(uploadParams, (progress) => {
                onProgress((progress.loaded / progress.total) * 100);
            });

            await Progress;
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
        }
    }

    // بارگذاری آواتار
    async uploadAvatar(file: File, onProgress: (progress: number) => void): Promise<void> {
        const bucketName = "avatars";
        const key = "cnquoiuti9t846v7";

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file
        };

        try {
            const { Progress } = s3.upload(uploadParams, (progress) => {
                onProgress((progress.loaded / progress.total) * 100);
            });

            await Progress;
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    }

    // بارگذاری پادکست
    async uploadPodcast(file: File, onProgress: (progress: number) => void): Promise<void> {
        const bucketName = "podcasts";
        const key = "cenolna40ddkonth";

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file
        };

        try {
            const { Progress } = s3.upload(uploadParams, (progress) => {
                onProgress((progress.loaded / progress.total) * 100);
            });

            await Progress;
        } catch (error) {
            console.error("Error uploading podcast:", error);
        }
    }

    // بارگذاری تصویر بندانگشتی برای استریم
    async uploadStreamThumbnail(file: File, onProgress: (progress: number) => void): Promise<void> {
        const bucketName = "stream-thumbnails";
        const key = "rb1pdd52fbk9kgip";

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file
        };

        try {
            const { Progress } = s3.upload(uploadParams, (progress) => {
                onProgress((progress.loaded / progress.total) * 100);
            });

            await Progress;
        } catch (error) {
            console.error("Error uploading stream thumbnail:", error);
        }
    }

    // حذف فایل
    async deleteFile(bucket: string, key: string): Promise<void> {
        const deleteParams = {
            Bucket: bucket,
            Key: key
        };

        try {
            await s3.deleteObject(deleteParams);
            console.log("File deleted successfully");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
}

export default new LiaraStorageService();