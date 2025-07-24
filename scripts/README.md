# 文件管理脚本

这个项目包含了一套自动化脚本来管理 `public` 目录下的静态文件。

## 脚本文件

### 核心模块
- `scripts/file-analysis.ts` - 共享的文件分析模块，包含核心分析逻辑

### 功能脚本
- `scripts/analyze-unused-files.ts` - 分析并显示详细的文件使用情况
- `scripts/clean-unused-files.ts` - 清理未使用的文件（慎用！）
- `scripts/manage-files.ts` - 统一的文件管理入口

## 使用方法

### 1. 快速分析文件使用情况
```bash
npm run analyze-files
# 或
npm run manage-files analyze
```

### 2. 清理未使用的文件
```bash
npm run clean-files
# 或  
npm run manage-files clean
```

### 3. 查看帮助
```bash
npm run manage-files help
```


## 功能特性

### 智能文件引用检测
脚本会在以下位置搜索文件引用：
- `src/**/*.{js,jsx,ts,tsx,md,mdx}`
- `*.{js,jsx,ts,tsx,md,mdx}`
- `app/**/*.{js,jsx,ts,tsx,md,mdx}`

### 多种引用格式支持
- 直接文件名：`favicon.svg`
- 绝对路径：`/favicon.svg`
- 各种引号格式：`"favicon.svg"`, `'favicon.svg'`, `` `favicon.svg` ``
- 正则表达式匹配：转义特殊字符

### 安全清理
- 详细的分析报告
- 清理前确认提示
- 支持手动删除命令生成

## 输出示例

### 分析输出
```
🔍 分析 public 目录下的文件使用情况...

检查文件: favicon.svg
  ✅ 使用中 (2 个引用)
    - src\app\layout.tsx: favicon.svg
    - src\app\layout.tsx: /favicon.svg

📊 总结:
总文件数: 2
使用中: 2
未使用: 0
```

### 清理输出
```
🧹 开始清理未使用的文件...

🗑️  发现 1 个未使用的文件:
  - old-icon.svg

⚠️  为了安全起见，请手动确认后再删除！

💡 删除命令:
Remove-Item "public/old-icon.svg"
```

## 技术实现

### 依赖包
- `glob` - 文件匹配
- `fs` - 文件系统操作
- `path` - 路径处理

### TypeScript 类型
```typescript
interface FileAnalysisResult {
  file: string;
  used: boolean;
  references: string[];
}

interface AnalysisResult {
  totalFiles: number;
  usedFiles: number;
  unusedFiles: number;
  results: FileAnalysisResult[];
}
```

### 核心函数
- `findFileReferences(fileName: string)` - 查找文件引用
- `analyzeAllFiles()` - 分析所有文件
- `getPublicFiles()` - 获取公共目录文件列表

## 注意事项

1. **谨慎使用清理功能** - 在生产环境中运行清理脚本前请仔细检查
2. **备份重要文件** - 建议在清理前备份重要的静态资源
3. **检查动态引用** - 脚本可能无法检测到动态生成的文件路径
4. **测试环境验证** - 在开发环境中充分测试后再应用到生产环境

## 扩展性

这个脚本系统具有良好的扩展性：
- 可以轻松添加新的文件类型支持
- 支持自定义搜索模式
- 可以集成到 CI/CD 流程中
- 支持更复杂的文件依赖分析
