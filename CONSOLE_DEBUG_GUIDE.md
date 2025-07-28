# Bidlink 控制台调试指南

## 🚀 快速开始

### 1. 启动应用
```bash
npm run dev
```

### 2. 打开浏览器控制台
- 访问 http://localhost:3000（任何页面）
- 按 F12 打开开发者工具
- 切换到控制台 (Console) 标签

### 3. 显示调试面板
```javascript
showDebugPanel()
```

### 4. 启用调试模式
```javascript
enableBidlinkDebugMode()
```

## 📋 控制台命令大全

### 🎛️ 面板控制
```javascript
showDebugPanel()     // 显示调试面板
hideDebugPanel()     // 隐藏调试面板  
showDebugPanel()   // 切换面板显示状态
```

### 🔧 调试模式
```javascript
enableBidlinkDebugMode()    // 启用调试模式（自动创建模拟接口）
disableBidlinkDebugMode()   // 禁用调试模式
getBidlinkDebugStatus()     // 查看当前调试状态
```

### ❓ 帮助命令
```javascript
bidlinkHelp()              // 显示所有可用命令
```


## 🔍 调试面板功能

调试面板提供：
- ✅ **实时状态监控**：调试模式、Bidlink检测、模拟接口状态
- 🎚️ **一键开关**：快速启用/禁用调试模式
- 📤 **测试按钮**：直接测试日志上传功能
- 📋 **结果显示**：实时显示上传成功/失败状态
- ❌ **关闭按钮**：可随时隐藏面板

## 🛠️ 模拟环境说明

### 模拟用户信息
- **用户ID**: `debug_user_123`
- **日志文件数**: 3个
- **总文件大小**: 50KB

### 模拟Android接口
启用调试模式后自动创建以下模拟接口：
- `getCurrentUserId()` - 获取用户ID
- `getUserLogInfo()` - 获取日志信息
- `createUserLogZip()` - 创建日志压缩包
- `readCacheFile()` - 读取文件内容
- `cleanupUserLogs()` - 清理日志文件
- `getAppInfo()` - 获取应用信息

## 💡 开发技巧

### 查看详细日志
```javascript
// 启用调试模式后，所有操作都会在控制台输出详细日志
enableBidlinkDebugMode()
```

### 重置调试状态
```javascript
// 如果遇到问题，可以重置调试状态
disableBidlinkDebugMode()
enableBidlinkDebugMode()
```

## 🚨 故障排除

### 命令无效？
确保在开发环境运行：
```javascript
// 检查环境
console.log('环境:', process.env.NODE_ENV)
```

### 面板不显示？
强制显示面板：
```javascript
showDebugPanel()
```

### 重新初始化所有功能
刷新页面后所有命令会自动重新初始化。

## 🔒 安全说明

- 所有调试功能仅在开发环境 (`NODE_ENV=development`) 可用
- 生产环境会自动禁用调试命令和面板
- 模拟数据不会影响真实环境

## 🎉 完成！

现在你可以在任何页面使用 `showDebugPanel()` 来开始调试了！

所有命令在应用启动时自动注册到全局 `window` 对象，随时可用。
