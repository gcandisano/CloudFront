import { getEnvironmentConfig } from '@/config/environment'

export interface S3UploadResponse {
  success: boolean
  url?: string
  error?: string
}

/**
 * Generate a unique filename for S3 upload
 * @param originalName - Original filename
 * @returns Unique filename with timestamp and random string
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || ''
  return `products/${timestamp}-${randomString}.${extension}`
}

/**
 * Upload file to S3 bucket
 * @param file - File to upload
 * @returns Promise with upload result
 */
export async function uploadToS3(file: File): Promise<S3UploadResponse> {
  try {
    const config = getEnvironmentConfig()
    const uniqueFileName = generateUniqueFileName(file.name)
    const uploadUrl = `${config.s3Url}/${uniqueFileName}`

    // Upload file to S3 using PUT request
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return {
      success: true,
      url: uploadUrl,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }
  }
}

/**
 * Upload multiple files to S3
 * @param files - Array of files to upload
 * @returns Promise with array of upload results
 */
export async function uploadMultipleToS3(files: File[]): Promise<S3UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadToS3(file))
  return Promise.all(uploadPromises)
}
