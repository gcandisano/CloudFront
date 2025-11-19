import { API_BASE_URL, getAuthHeaders } from './index'

export interface S3UploadResponse {
  success: boolean
  url?: string
  error?: string
}

interface PresignedUrlResponse {
  presignedUrl: string
  key: string
  expiresIn: number
  publicUrl: string
}

/**
 * Upload file to S3 bucket using presigned URL from backend
 * @param file - File to upload
 * @returns Promise with upload result
 */
export async function uploadToS3(file: File): Promise<S3UploadResponse> {
  try {
    // Paso 1: Obtener presigned URL del backend
    const presignedResponse = await fetch(`${API_BASE_URL}/images/presigned-url`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        folder: 'products',
      }),
    })

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to get presigned URL: ${presignedResponse.status}`)
    }

    const presignedData: PresignedUrlResponse = await presignedResponse.json()

    // Paso 2: Subir archivo a S3 usando presigned URL
    const uploadResponse = await fetch(presignedData.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
    }

    return {
      success: true,
      url: presignedData.publicUrl,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }
  }
}
