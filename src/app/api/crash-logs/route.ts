import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CRASH_LOGS_DIR = path.join(process.cwd(), 'uploads/crash-logs')

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        type CrashLogFile = {
            fileName: string
            userId: string
            fileSize: number
            fileSizeReadable: string
            uploadTime: Date
        }
        const files: CrashLogFile[] = [];
        if (!userId) {
            // userId 不存在直接返回空数组
            return NextResponse.json({ files });
        }
        const devicePath = path.join(CRASH_LOGS_DIR, userId);
        try {
            const stat = await fs.stat(devicePath);
            if (!stat.isDirectory()) {
                return NextResponse.json({ files });
            }
            const logFiles = await fs.readdir(devicePath);
            for (const fileName of logFiles) {
                const filePath = path.join(devicePath, fileName);
                const fileStat = await fs.stat(filePath);
                if (!fileName.endsWith('.jsonl')) continue;
                files.push({
                    fileName: `uploads/crash-logs/${userId}/${fileName}`,
                    userId,
                    fileSize: fileStat.size,
                    fileSizeReadable: (fileStat.size / 1024).toFixed(1) + ' KB',
                    uploadTime: fileStat.mtime
                });
            }
        } catch {
            // 目录不存在也返回空数组
            return NextResponse.json({ files });
        }
        files.sort((a, b) => +new Date(b.uploadTime) - +new Date(a.uploadTime));
        return NextResponse.json({ files });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
