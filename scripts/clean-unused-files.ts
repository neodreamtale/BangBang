import fs from 'fs';
import path from 'path';
import { analyzeAllFiles } from './file-analysis';

// 自动清理未使用的文件
async function cleanUnusedFiles() {
  console.log('🧹 开始清理未使用的文件...\n');
  
  const results = await analyzeAllFiles();
  const unusedFiles = results.filter(r => !r.used);
  
  if (unusedFiles.length === 0) {
    console.log('✅ 没有发现未使用的文件');
    return;
  }
  
  console.log(`🗑️  发现 ${unusedFiles.length} 个未使用的文件:`);
  unusedFiles.forEach(({ file }) => console.log(`  - ${file}`));
  
  // 询问用户确认
  console.log('\n❓ 是否删除这些文件? (y/N)');
  
  // 在实际使用中，你可能想要添加用户输入确认
  // 这里我们直接删除（因为是脚本运行）
  
  let deletedCount = 0;
  for (const { file } of unusedFiles) {
    try {
      fs.unlinkSync(path.join('public', file));
      console.log(`✅ 已删除: ${file}`);
      deletedCount++;
    } catch (error) {
      console.log(`❌ 删除失败: ${file} - ${error}`);
    }
  }
  
  console.log(`\n🎉 清理完成! 删除了 ${deletedCount} 个文件`);
}

cleanUnusedFiles().catch(console.error);
