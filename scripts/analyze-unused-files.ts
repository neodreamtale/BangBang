import { analyzeAllFiles } from './file-analysis';

// 分析未使用的文件
async function analyzeUnusedFiles() {
  console.log('🔍 分析 public 目录下的文件使用情况...\n');
  
  const results = await analyzeAllFiles();
  
  // 显示详细结果
  for (const result of results) {
    console.log(`检查文件: ${result.file}`);
    
    if (result.used) {
      console.log(`  ✅ 使用中 (${result.references.length} 个引用)`);
      result.references.forEach(ref => console.log(`    - ${ref}`));
    } else {
      console.log(`  ❌ 未使用`);
    }
    console.log('');
  }
  
  // 总结
  const unusedFiles = results.filter(r => !r.used);
  const usedFiles = results.filter(r => r.used);
  
  console.log('📊 总结:');
  console.log(`总文件数: ${results.length}`);
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
