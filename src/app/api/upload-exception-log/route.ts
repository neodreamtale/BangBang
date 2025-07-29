import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const metadata = formData.get('metadata') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 验证文件类型（只允许日志文件）
        const allowedExtensions = ['.log', '.txt', '.crash', '.error', '.exception'];
        const isValidFile = allowedExtensions.some(ext =>
            file.name.toLowerCase().endsWith(ext)
        ) || file.type === 'text/plain';

        if (!isValidFile) {
            return NextResponse.json(
                { error: 'Invalid file type. Only log files are allowed.' },
                { status: 400 }
            );
        }

        // 限制文件大小（最大10MB）
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 400 }
            );
        }

        // 解析元数据
        let fileMetadata;
        try {
            fileMetadata = metadata ? JSON.parse(metadata) : {};
        } catch {
            fileMetadata = { name: file.name, size: file.size };
        }

        // 读取文件内容
        const fileContent = await file.text();

        // 生成唯一文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `exception-${timestamp}-${fileMetadata.name || file.name}`;

        // 分析异常日志内容
        const logAnalysis = analyzeExceptionLog(fileContent);

        // 在开发环境保存文件
        if (process.env.NODE_ENV === 'development') {
            try {
                const fs = await import('fs').then(m => m.promises);
                const path = await import('path');

                const uploadsDir = path.join(process.cwd(), 'uploads', 'exception-logs');
                await fs.mkdir(uploadsDir, { recursive: true });

                const filePath = path.join(uploadsDir, fileName);
                await fs.writeFile(filePath, fileContent, 'utf8');

                console.log(`Exception log saved: ${filePath}`);
                console.log('Log analysis:', logAnalysis);
            } catch (fsError) {
                console.error('Failed to save file:', fsError);
            }
        }

        // 这里您可以添加：
        // 1. 发送到日志分析服务
        // 2. 存储到数据库
        // 3. 发送告警通知
        // 4. 上传到云存储

        return NextResponse.json({
            success: true,
            message: 'Exception log uploaded successfully',
            fileName: fileName,
            originalName: fileMetadata.name || file.name,
            size: file.size,
            uploadTime: new Date().toISOString(),
            analysis: logAnalysis
        });

    } catch (error) {
        console.error('Exception log upload error:', error);
        return NextResponse.json(
            {
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * 分析异常日志内容
 */
function analyzeExceptionLog(content: string) {
    const lines = content.split('\n').filter(line => line.trim());

    const analysis = {
        totalLines: lines.length,
        errorCount: 0,
        crashCount: 0,
        exceptionCount: 0,
        fatalCount: 0,
        exceptionTypes: [] as string[],
        errorKeywords: [] as string[],
        lastCrashTime: null as string | null,
        stackTraces: 0,
        memoryErrors: 0,
        networkErrors: 0
    };

    const exceptionPatterns = [
        /(\w+Exception):/g,
        /(\w+Error):/g,
        /Fatal signal/i,
        /SIGSEGV/i,
        /OutOfMemoryError/i,
        /StackOverflowError/i
    ];

    lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();

        // 统计错误类型
        if (lowerLine.includes('error')) analysis.errorCount++;
        if (lowerLine.includes('crash')) analysis.crashCount++;
        if (lowerLine.includes('exception')) analysis.exceptionCount++;
        if (lowerLine.includes('fatal')) analysis.fatalCount++;

        // 提取异常类型
        exceptionPatterns.forEach(pattern => {
            const matches = line.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (!analysis.exceptionTypes.includes(match)) {
                        analysis.exceptionTypes.push(match);
                    }
                });
            }
        });

        // 检测特定问题
        if (lowerLine.includes('outofmemory') || lowerLine.includes('out of memory')) {
            analysis.memoryErrors++;
        }

        if (lowerLine.includes('network') || lowerLine.includes('connection') || lowerLine.includes('timeout')) {
            analysis.networkErrors++;
        }

        if (lowerLine.includes('at ') && lowerLine.includes('(') && lowerLine.includes(')')) {
            analysis.stackTraces++;
        }

        // 提取时间戳（如果有）
        const timeMatch = line.match(/\d{4}-\d{2}-\d{2}[\s|T]\d{2}:\d{2}:\d{2}/);
        if (timeMatch && lowerLine.includes('crash')) {
            analysis.lastCrashTime = timeMatch[0];
        }

        // 收集错误关键词
        const errorKeywords = ['nullpointer', 'classcast', 'indexoutofbound', 'illegalargument', 'securityexception'];
        errorKeywords.forEach(keyword => {
            if (lowerLine.includes(keyword) && !analysis.errorKeywords.includes(keyword)) {
                analysis.errorKeywords.push(keyword);
            }
        });
    });

    return analysis;
}
