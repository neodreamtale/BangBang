import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(_: Request, context: any) {
  const filename = context?.params?.filename;
  try {
    const filePath = path.join(process.cwd(), 'uploads', 'crash-logs', filename)
    console.info(filename, filePath)
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 })
    }
    const fileBuffer = await readFile(filePath)
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('下载文件失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
