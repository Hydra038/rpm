import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const directory = formData.get('directory') as string || 'general';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Create safe filename
    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase();
    const safeName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .toLowerCase();

    // Create directory path
    const uploadDir = join(process.cwd(), 'public', 'images', 'products', directory);
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Full file path
    const filePath = join(uploadDir, safeName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/images/products/${directory}/${safeName}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      filename: safeName,
      directory: directory,
      publicUrl: publicUrl,
      size: buffer.length
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file: ' + error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Image upload endpoint - use POST to upload files',
    supportedFormats: ['JPEG', 'PNG', 'WebP'],
    directories: ['engine', 'brake', 'electrical', 'interior', 'suspension', 'exhaust', 'general']
  });
}