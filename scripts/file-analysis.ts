import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 文件分析结果类型
export interface FileAnalysisResult {
  file: string;
  used: boolean;
  references: string[];
}

// 获取 public 目录下的所有文件
export function getPublicFiles(): string[] {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    return [];
  }
  const files = fs.readdirSync(publicDir);
  return files.filter(file => !file.startsWith('.'));
}

// 搜索源代码中的文件引用（统一的搜索逻辑）
export async function findFileReferences(fileName: string): Promise<string[]> {
  const patterns = [
    `src/**/*.{js,jsx,ts,tsx,md,mdx}`,
    `*.{js,jsx,ts,tsx,md,mdx}`,
    `app/**/*.{js,jsx,ts,tsx,md,mdx}`
  ];
  
  const references: string[] = [];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern);
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          
          // 统一的搜索模式（6种）
          const searchPatterns = [
            fileName,                           // 直接文件名
            `/${fileName}`,                     // 绝对路径
            `"${fileName}"`,                    // 双引号
            `'${fileName}'`,                    // 单引号
            `\`${fileName}\``,                  // 反引号
            fileName.replace(/\./g, '\\.'),     // 转义点号的正则
          ];
          
          for (const searchPattern of searchPatterns) {
            if (content.includes(searchPattern)) {
              references.push(`${file}: ${searchPattern}`);
            }
          }
        } catch (error) {
          // 忽略读取错误
        }
      }
    } catch (error) {
      // 忽略 glob 错误
    }
  }
  
  return references;
}

// 检查单个文件是否被使用
export async function isFileUsed(fileName: string): Promise<boolean> {
  const references = await findFileReferences(fileName);
  return references.length > 0;
}

// 分析所有文件的使用情况
export async function analyzeAllFiles(): Promise<FileAnalysisResult[]> {
  const publicFiles = getPublicFiles();
  const results: FileAnalysisResult[] = [];
  
  for (const file of publicFiles) {
    const references = await findFileReferences(file);
    const isUsed = references.length > 0;
    
    results.push({
      file,
      used: isUsed,
      references
    });
  }
  
  return results;
}

// 获取未使用的文件列表
export async function getUnusedFiles(): Promise<string[]> {
  const results = await analyzeAllFiles();
  return results.filter(r => !r.used).map(r => r.file);
}
