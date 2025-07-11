import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Initialize S3 client if configured
let s3Client: S3Client | null = null
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  })
}

// Local storage configuration
const USE_LOCAL_STORAGE = process.env.USE_LOCAL_STORAGE === 'true' || !s3Client
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || '/tmp/blueprint-uploads'

/**
 * Ensure local storage directory exists
 */
async function ensureLocalStorageDir() {
  if (USE_LOCAL_STORAGE) {
    await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true })
  }
}

/**
 * Generate a unique filename for uploaded files
 */
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const hash = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${hash}${ext}`
}

/**
 * Upload a file to storage (S3 or local)
 */
export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  const filename = generateUniqueFilename(originalName)
  
  if (USE_LOCAL_STORAGE) {
    // Local storage
    await ensureLocalStorageDir()
    const filePath = path.join(LOCAL_STORAGE_PATH, filename)
    await fs.writeFile(filePath, buffer)
    return filePath
  } else {
    // S3 storage
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `blueprints/${filename}`,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        originalName: originalName,
        uploadDate: new Date().toISOString()
      }
    })
    
    await s3Client!.send(command)
    return `s3://${process.env.AWS_S3_BUCKET}/blueprints/${filename}`
  }
}

/**
 * Get a file from storage
 */
export async function getFile(filePath: string): Promise<Buffer> {
  if (filePath.startsWith('s3://')) {
    // S3 storage
    const [bucket, ...keyParts] = filePath.replace('s3://', '').split('/')
    const key = keyParts.join('/')
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
    
    const response = await s3Client!.send(command)
    const chunks: Uint8Array[] = []
    
    if (response.Body) {
      for await (const chunk of response.Body as any) {
        chunks.push(chunk)
      }
    }
    
    return Buffer.concat(chunks)
  } else {
    // Local storage
    return await fs.readFile(filePath)
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (filePath.startsWith('s3://')) {
    // S3 deletion would go here
    console.log('S3 deletion not implemented')
  } else {
    // Local storage
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
}

/**
 * Clean up old files (older than 24 hours)
 */
export async function cleanupOldFiles(): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    await ensureLocalStorageDir()
    const files = await fs.readdir(LOCAL_STORAGE_PATH)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    
    for (const file of files) {
      const filePath = path.join(LOCAL_STORAGE_PATH, file)
      const stats = await fs.stat(filePath)
      
      if (stats.mtimeMs < oneDayAgo) {
        await deleteFile(filePath)
      }
    }
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800') // 50MB default
  const ALLOWED_TYPES = ['application/pdf']
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_SIZE / 1024 / 1024}MB`
    }
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF files are allowed'
    }
  }
  
  return { valid: true }
}