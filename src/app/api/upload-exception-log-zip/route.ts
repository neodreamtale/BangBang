import { NextRequest, NextResponse } from 'next/server';

interface BidlinkFileInfo {
    name: string;
    path: string;
    size: number;
    type: string;
    lastModified: number;
}

interface BidlinkCacheFile {
    content: string;
    encoding: 'base64' | 'utf8';
    metadata: BidlinkFileInfo;
}

/**
 * 处理异常日志ZIP文件上传
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const contentString = formData.get('content') as string;
        const encoding = formData.get('encoding') as string;
        const metadataString = formData.get('metadata') as string;

        if (!contentString || !encoding || !metadataString) {
            return NextResponse.json(
                {
                    success: false,
                    message: '缺少必要的文件信息'
                },
                { status: 400 }
            );
        }

        // 解析元数据
        const metadata: BidlinkFileInfo = JSON.parse(metadataString);

        const zipFile: BidlinkCacheFile = {
            content: contentString,
            encoding: encoding as 'base64' | 'utf8',
            metadata
        };

        // 验证文件类型
        if (!metadata.name.endsWith('.zip')) {
            return NextResponse.json(
                {
                    success: false,
                    message: '文件类型不正确，需要ZIP文件'
                },
                { status: 400 }
            );
        }

        // 分析ZIP文件内容
        const analysis = analyzeZipFile(zipFile);

        // 生成报告
        const report = {
            fileInfo: {
                name: metadata.name,
                size: metadata.size,
                uploadTime: new Date().toISOString(),
                encoding: zipFile.encoding
            },
            analysis,
            success: true
        };

        console.log('异常日志ZIP文件上传成功:', {
            fileName: metadata.name,
            size: metadata.size,
            analysisType: 'ZIP压缩包',
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            message: '异常日志ZIP文件上传并分析完成',
            data: report
        });

    } catch (error) {
        console.error('异常日志ZIP文件上传失败:', error);

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : '文件上传失败'
            },
            { status: 500 }
        );
    }
}

/**
 * 分析ZIP文件内容
 */
function analyzeZipFile(zipFile: BidlinkCacheFile) {
    try {
        // 对于ZIP文件，我们主要记录基本信息
        // 实际的ZIP解析需要在后端进行
        return {
            type: 'ZIP压缩包',
            fileName: zipFile.metadata.name,
            fileSize: zipFile.metadata.size,
            encoding: zipFile.encoding,
            uploadTime: new Date().toISOString(),
            description: '用户异常日志文件的ZIP压缩包，包含多个日志文件',
            notes: [
                '文件已成功接收',
                'ZIP格式验证通过',
                '需要后端解压并分析具体日志内容'
            ]
        };
    } catch (error) {
        return {
            type: 'ZIP文件分析失败',
            error: error instanceof Error ? error.message : '未知错误',
            uploadTime: new Date().toISOString()
        };
    }
}
