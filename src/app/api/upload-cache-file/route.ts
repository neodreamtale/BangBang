import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const metadata = formData.get('metadata') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 解析元数据
        let fileMetadata;
        try {
            fileMetadata = JSON.parse(metadata);
        } catch {
            fileMetadata = { name: file.name, size: file.size };
        }

        // 这里您可以将文件保存到云存储或本地
        // 示例：保存到本地 uploads 目录
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 生成唯一文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}-${fileMetadata.name}`;

        // 在实际应用中，您可能想要：
        // 1. 保存到云存储 (AWS S3, 阿里云 OSS 等)
        // 2. 保存到数据库记录
        // 3. 发送到日志分析系统

        console.log('Received cache file upload:', {
            originalName: fileMetadata.name,
            size: fileMetadata.size,
            uploadedSize: buffer.length,
            fileName: fileName
        });

        // 返回成功响应
        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                name: fileName,
                originalName: fileMetadata.name,
                size: buffer.length,
                uploadTime: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
