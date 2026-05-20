import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';

const DEFAULT_BUCKET = 'media';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazily initialise and return the Supabase client.
 * Throws if the required env vars are missing.
 */
const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set'
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

/**
 * Generate a unique filename to avoid collisions.
 *
 * Format: `<timestamp>-<random>.<ext>`
 *
 * @param originalName - The original file name (used to extract the extension)
 * @returns A unique filename string
 */
const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}${ext}`;
};

/**
 * Upload a file buffer to Supabase Storage and return its public URL.
 *
 * @param bucket      - Storage bucket name (default: 'media')
 * @param filePath    - Destination path inside the bucket (e.g. 'avatars/user123.png')
 * @param fileBuffer  - The file contents as a Buffer
 * @param contentType - MIME type of the file (e.g. 'image/png')
 * @returns           The public URL of the uploaded file
 */
export const uploadFile = async (
  bucket: string = DEFAULT_BUCKET,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> => {
  const client = getSupabaseClient();

  // Generate a unique name to prevent overwrites
  const uniqueName = generateUniqueFilename(filePath);
  const dir = path.dirname(filePath);
  const fullPath = dir && dir !== '.' ? `${dir}/${uniqueName}` : uniqueName;

  const { error } = await client.storage
    .from(bucket)
    .upload(fullPath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = client.storage.from(bucket).getPublicUrl(fullPath);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to retrieve public URL after upload');
  }

  return urlData.publicUrl;
};

/**
 * Delete a file from Supabase Storage.
 *
 * @param bucket   - Storage bucket name (default: 'media')
 * @param filePath - The path of the file inside the bucket
 */
export const deleteFile = async (
  bucket: string = DEFAULT_BUCKET,
  filePath: string
): Promise<void> => {
  const client = getSupabaseClient();

  const { error } = await client.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Supabase storage delete failed: ${error.message}`);
  }
};

export { DEFAULT_BUCKET, generateUniqueFilename, getSupabaseClient };
