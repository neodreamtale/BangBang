#!/usr/bin/env node

import { analyzeAllFiles } from './file-analysis';

// 文件管理主脚本
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'analyze':
    case 'check':
      await analyzeFiles();
      break;
    case 'clean':
    case 'delete':
      await cleanFiles();
      break;
    case 'help':
    case '--help':
    case '-h':
    default:
      showHelp();
      break;
  }
}

async function analyzeFiles() {
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
    console.log(`npm run clean-files`);
    console.log('或者手动删除:');
    unusedFiles.forEach(({ file }) => {
      console.log(`Remove-Item "public/${file}"`);
    });
  }
}

async function cleanFiles() {
  console.log('🧹 开始清理未使用的文件...\n');
  
  const results = await analyzeAllFiles();
  const unusedFiles = results.filter(r => !r.used);
  
  if (unusedFiles.length === 0) {
    console.log('✅ 没有发现未使用的文件');
    return;
  }
  
  console.log(`🗑️  发现 ${unusedFiles.length} 个未使用的文件:`);
  unusedFiles.forEach(({ file }) => console.log(`  - ${file}`));
  
  console.log('\n⚠️  为了安全起见，请手动确认后再删除！');
  console.log('\n💡 删除命令:');
  unusedFiles.forEach(({ file }) => {
    console.log(`Remove-Item "public/${file}"`);
  });
}

function showHelp() {
  console.log(`
📁 文件管理工具

用法:
  npm run manage-files <command>

命令:
  analyze, check    分析文件使用情况
  clean, delete     清理未使用的文件
  help             显示帮助信息

示例:
  npm run manage-files analyze
  npm run manage-files clean

脚本文件:
  scripts/analyze-unused-files.ts  - 详细分析脚本
  scripts/clean-unused-files.ts    - 自动清理脚本 (慎用!)
  scripts/file-analysis.ts         - 共享分析模块
`);
}

main().catch(console.error);
