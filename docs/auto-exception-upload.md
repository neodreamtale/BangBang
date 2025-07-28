# Bidlink应用异常日志自动上传功能

## 🎯 功能概述

现在的Bug反馈系统已经完全自动化，无需用户手动选择文件。系统会自动检测和上传异常日志文件。

## ✨ 新功能特点

### 1. **完全自动化**
- 🔍 **自动检测**：页面加载时自动扫描固定路径的异常日志
- 📊 **状态显示**：实时显示发现的日志文件数量和大小  
- 🚀 **一键上传**：用户可以选择立即上传或随反馈一起提交
- 📈 **智能分析**：服务器端自动分析异常日志内容

### 2. **用户体验优化**
- ✅ **无需手动操作**：系统自动获取异常日志，用户无需选择文件
- 📱 **状态透明**：清晰显示日志检测和上传状态
- ⚙️ **可选上传**：用户可以控制是否上传异常日志
- 💬 **即时反馈**：上传成功后显示分析结果

## 🔧 Android端需要配置的文件路径

系统会自动检测以下固定路径的异常日志文件：

```
/data/data/com.bidlink.cn/files/crash.log          # 崩溃日志
/data/data/com.bidlink.cn/files/exception.log      # 异常日志  
/data/data/com.bidlink.cn/files/error.log          # 错误日志
/data/data/com.bidlink.cn/cache/app_crash.log      # 应用崩溃日志
/data/data/com.bidlink.cn/cache/runtime_error.log  # 运行时错误日志
```

## 📱 Android端需要实现的JavaScript接口

```java
public class BidlinkInterface {
    
    @JavascriptInterface
    public String getFileInfo(String filePath) {
        try {
            File file = new File(filePath);
            if (!file.exists() || !isValidLogPath(filePath)) {
                return null;
            }

            JSONObject info = new JSONObject();
            info.put("exists", true);
            info.put("size", file.length());
            info.put("lastModified", file.lastModified());
            return info.toString();
        } catch (Exception e) {
            return null;
        }
    }

    @JavascriptInterface
    public String readFile(String filePath) {
        try {
            if (!isValidLogPath(filePath)) {
                throw new SecurityException("Invalid file path");
            }

            File file = new File(filePath);
            if (!file.exists()) {
                return null;
            }

            // 限制文件大小（最大5MB）
            if (file.length() > 5 * 1024 * 1024) {
                throw new IOException("File too large");
            }

            StringBuilder content = new StringBuilder();
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\\n");
            }
            reader.close();

            return content.toString();
        } catch (Exception e) {
            return null;
        }
    }
    
    // 安全检查：只允许访问特定的日志文件路径
    private boolean isValidLogPath(String filePath) {
        String[] allowedPaths = {
            "/data/data/com.bidlink.cn/files/crash.log",
            "/data/data/com.bidlink.cn/files/error.log",
            "/data/data/com.bidlink.cn/files/exception.log",
            "/data/data/com.bidlink.cn/cache/app_crash.log",
            "/data/data/com.bidlink.cn/cache/runtime_error.log"
        };

        for (String allowedPath : allowedPaths) {
            if (filePath.equals(allowedPath)) {
                return true;
            }
        }
        return false;
    }
}
```

## 🚀 Web端使用流程

### 用户操作流程：
1. **打开Bug反馈页面**：用户在Bidlink应用中打开反馈页面
2. **自动检测**：系统自动检测到应用环境并扫描异常日志
3. **状态显示**：显示"发现 X 个异常日志文件"
4. **填写反馈**：用户填写Bug描述和重现步骤
5. **选择上传**：用户可以选择是否随反馈一起提交异常日志
6. **提交完成**：一键提交，系统自动处理所有技术细节

### 开发者获得的信息：
- 详细的Bug描述
- 重现步骤
- 自动检测的环境信息
- 相关的异常日志文件
- 智能分析的日志摘要


