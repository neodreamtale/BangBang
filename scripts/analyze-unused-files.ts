import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 获取 public 目录下的所有文件
function getPublicFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir);
  return files.filter(file => !file.startsWith('.'));
}

// 搜索源代码中的文件引用
async function findFileReferences(fileName: string) {
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
          
          // 检查各种可能的引用方式
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

// 分析未使用的文件
async function analyzeUnusedFiles() {
  console.log('🔍 分析 public 目录下的文件使用情况...\n');
  
  const publicFiles = getPublicFiles();
  const results: { file: string; used: boolean; references: string[] }[] = [];
  
  for (const file of publicFiles) {
    console.log(`检查文件: ${file}`);
    const references = await findFileReferences(file);
    const isUsed = references.length > 0;
    
    results.push({
      file,
      used: isUsed,
      references
    });
    
    if (isUsed) {
      console.log(`  ✅ 使用中 (${references.length} 个引用)`);
      references.forEach(ref => console.log(`    - ${ref}`));
    } else {
      console.log(`  ❌ 未使用`);
    }
    console.log('');
  }
  
  // 总结
  const unusedFiles = results.filter(r => !r.used);
  const usedFiles = results.filter(r => r.used);
  
  console.log('📊 总结:');
  console.log(`总文件数: ${publicFiles.length}`);
  console.log(`使用中: ${usedFiles.length}`);
  console.log(`未使用: ${unusedFiles.length}`);
  
  if (unusedFiles.length > 0) {
    console.log('\n🗑️  可以安全删除的文件:');
    unusedFiles.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
    
    console.log('\n💡 删除命令:');
    unusedFiles.forEach(({ file }) => {
      console.log(`Remove-Item "public/${file}"`);
    });
  }
  
  return results;
}

// 运行分析
analyzeUnusedFiles().catch(console.error);
