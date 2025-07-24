import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 自动清理未使用的文件
async function cleanUnusedFiles() {
  console.log('🧹 开始清理未使用的文件...\n');
  
  const publicDir = 'public';
  const publicFiles = fs.readdirSync(publicDir).filter(file => !file.startsWith('.'));
  
  const filesToDelete: string[] = [];
  
  for (const file of publicFiles) {
    const isUsed = await isFileUsed(file);
    if (!isUsed) {
      filesToDelete.push(file);
    }
  }
  
  if (filesToDelete.length === 0) {
    console.log('✅ 没有发现未使用的文件');
    return;
  }
  
  console.log(`🗑️  发现 ${filesToDelete.length} 个未使用的文件:`);
  filesToDelete.forEach(file => console.log(`  - ${file}`));
  
  // 询问用户确认
  console.log('\n❓ 是否删除这些文件? (y/N)');
  
  // 在实际使用中，你可能想要添加用户输入确认
  // 这里我们直接删除（因为是脚本运行）
  
  let deletedCount = 0;
  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(path.join(publicDir, file));
      console.log(`✅ 已删除: ${file}`);
      deletedCount++;
    } catch (error) {
      console.log(`❌ 删除失败: ${file} - ${error}`);
    }
  }
  
  console.log(`\n🎉 清理完成! 删除了 ${deletedCount} 个文件`);
}

async function isFileUsed(fileName: string): Promise<boolean> {
  const patterns = [
    'src/**/*.{js,jsx,ts,tsx,md,mdx}',
    '*.{js,jsx,ts,tsx,md,mdx}'
  ];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern);
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          if (content.includes(fileName) || content.includes(`/${fileName}`)) {
            return true;
          }
        } catch {
          // 忽略读取错误
        }
      }
    } catch {
      // 忽略 glob 错误
    }
  }
  
  return false;
}

cleanUnusedFiles().catch(console.error);
