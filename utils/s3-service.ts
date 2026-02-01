import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// AWS Configuration from environment variables
const AWS_REGION = process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1';
const AWS_BUCKET_NAME = process.env.EXPO_PUBLIC_AWS_BUCKET_NAME || '';
const AWS_ACCESS_KEY_ID = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '';

// Create S3 Client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * رفع صورة أو فيديو لـ AWS S3
 * @param uri - مسار الملف المحلي
 * @param type - نوع الملف (image أو video)
 * @param folder - المجلد في S3 (posts, profiles, comments)
 * @param onProgress - callback لتتبع تقدم الرفع
 */
export const uploadToS3 = async (
  uri: string,
  type: 'image' | 'video',
  folder: 'posts' | 'profiles' | 'comments' = 'posts',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // التحقق من وجود المعلومات المطلوبة
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return {
        success: false,
        error: 'معلومات AWS S3 غير مكتملة. يرجى التحقق من ملف .env.local',
      };
    }

    // قراءة الملف
    const response = await fetch(uri);
    const blob = await response.blob();

    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;

    // تحديد Content-Type
    let contentType = '';
    if (type === 'image') {
      contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    } else {
      contentType = `video/${extension}`;
    }

    // رفع الملف
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ContentType: contentType,
        ACL: 'public-read',
      },
    });

    // تتبع تقدم الرفع
    if (onProgress) {
      upload.on('httpUploadProgress', (progress) => {
        if (progress.loaded && progress.total) {
          onProgress({
            loaded: progress.loaded,
            total: progress.total,
            percentage: Math.round((progress.loaded / progress.total) * 100),
          });
        }
      });
    }

    // انتظار اكتمال الرفع
    await upload.done();

    // إنشاء رابط الملف
    const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'فشل رفع الملف',
    };
  }
};

/**
 * رفع صورة البروفايل
 */
export const uploadProfileImage = async (
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return uploadToS3(uri, 'image', 'profiles', onProgress);
};

/**
 * رفع صورة منشور
 */
export const uploadPostImage = async (
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return uploadToS3(uri, 'image', 'posts', onProgress);
};

/**
 * رفع فيديو منشور
 */
export const uploadPostVideo = async (
  uri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return uploadToS3(uri, 'video', 'posts', onProgress);
};

/**
 * حذف ملف من S3 (اختياري)
 */
export const deleteFromS3 = async (fileUrl: string): Promise<boolean> => {
  try {
    // استخراج اسم الملف من الرابط
    const fileName = fileUrl.split('.com/')[1];
    
    if (!fileName) return false;

    // حذف الملف
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
      })
    );

    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
};

export default {
  uploadToS3,
  uploadProfileImage,
  uploadPostImage,
  uploadPostVideo,
  deleteFromS3,
};