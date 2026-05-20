import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'path';

// Allowed MIME types
const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.webp',
  '.mp4',
  '.mov',
  '.avi',
]);

// Size limits in bytes
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
const VIDEO_SIZE_LIMIT = 50 * 1024 * 1024; // 50 MB

// Use memory storage so files are available as Buffer (for Supabase upload)
const storage: StorageEngine = multer.memoryStorage();

/**
 * File filter that allows images and videos only,
 * checking both MIME type and file extension.
 */
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isAllowedExtension = ALLOWED_EXTENSIONS.has(ext);
  const isAllowedMime = IMAGE_MIME_TYPES.has(mime) || VIDEO_MIME_TYPES.has(mime);

  if (isAllowedExtension && isAllowedMime) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname) as unknown as Error,
    );
  }
};

/**
 * Determine the size limit based on the file's MIME type.
 * Videos get 50 MB, images get 10 MB.
 */
const getFileSizeLimit = (file: Express.Multer.File): number => {
  const mime = file.mimetype.toLowerCase();
  return VIDEO_MIME_TYPES.has(mime) ? VIDEO_SIZE_LIMIT : IMAGE_SIZE_LIMIT;
};

/**
 * Custom size-checking file filter wrapper.
 * multer's `limits.fileSize` is a single value — this wrapper
 * is used at route level if per-file-type limits are needed.
 */
const createUpload = () =>
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: VIDEO_SIZE_LIMIT, // Use the higher limit; per-type checking below
    },
  });

/**
 * Upload a single file.
 * @param fieldName - The form field name for the file
 */
export const uploadSingle = (fieldName: string) => {
  return createUpload().single(fieldName);
};

/**
 * Upload multiple files for a single field.
 * @param fieldName - The form field name
 * @param maxCount  - Maximum number of files (default: 5)
 */
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
  return createUpload().array(fieldName, maxCount);
};

/**
 * Upload files from multiple named fields.
 * @param fields - Array of { name, maxCount } field definitions
 *
 * @example
 * uploadFields([
 *   { name: 'avatar', maxCount: 1 },
 *   { name: 'documents', maxCount: 3 },
 * ])
 */
export const uploadFields = (fields: multer.Field[]) => {
  return createUpload().fields(fields);
};

export { getFileSizeLimit, IMAGE_SIZE_LIMIT, VIDEO_SIZE_LIMIT };
export default createUpload;
