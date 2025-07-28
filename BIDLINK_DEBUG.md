# Bidlink 调试模式使用说明

## 概述
为了方便在浏览器中调试 Bidlink WebView 功能，我们添加了调试模式。这样你就可以在开发环境中测试文件上传等功能，而不需要真实的 Android 环境。

## 启用调试模式

### 方法1: 使用调试面板（推荐）
1. 启动开发服务器 `npm run dev`
2. 访问 Bug 反馈页面：`http://localhost:3000/feedback/bug`
3. 在页面右下角会看到"🔧 Bidlink 调试面板"
4. 点击"启用调试模式"按钮

### 方法2: 使用浏览器控制台
打开浏览器控制台，运行：
```javascript
enableDebugMode()
```

### 方法3: 手动设置 localStorage
```javascript
localStorage.setItem('bidlink-debug-mode', 'true')
```

## 调试功能

### 模拟的 Android 接口
调试模式会自动创建模拟的 Android 接口，包括：

- `getCurrentUserId()` - 返回模拟用户ID: `debug_user_123`
- `getUserLogInfo(userId)` - 返回模拟日志信息（3个文件，50KB）
- `createUserLogZip(userId)` - 返回模拟ZIP文件路径
- `readCacheFile(filePath)` - 返回模拟文件内容
- `cleanupUserLogs(userId)` - 模拟删除日志文件
- `getAppInfo()` - 返回模拟应用信息

### 测试异常日志上传
1. 确保调试模式已启用
2. 在调试面板中点击"测试日志上传"按钮

## 调试面板功能

调试面板显示：
- ✅ 调试模式状态
- ✅ Bidlink 检测状态  
- 📤 一键测试上传功能
- 📋 上传结果显示

## 禁用调试模式

### 使用调试面板
点击"禁用调试模式"按钮

### 使用控制台
```javascript
disableBidlinkDebugMode()
```

### 手动清除
```javascript
localStorage.removeItem('bidlink-debug-mode')
```

## 注意事项

1. **仅在开发环境可用** - 调试模式只在 `NODE_ENV=development` 时生效
2. **自动模拟数据** - 所有文件操作都是模拟的，不会访问真实文件系统
3. **状态持久化** - 调试模式状态保存在 localStorage 中，刷新页面后仍然有效
4. **API 测试** - 可以测试完整的上传流程，包括 ZIP 文件处理 API

## 开发流程建议

1. 启用调试模式
2. 在 Bug 反馈页面测试基本功能
3. 使用调试面板测试自动上传
4. 查看控制台日志和网络请求
5. 根据需要调整模拟数据

这样你就可以在浏览器中完整测试所有 Bidlink 相关功能了！🎉
