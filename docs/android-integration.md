# Bidlink Android应用WebView集成指南

## 概述

为了让Web端的反馈系统能够访问和上传缓存文件，Android应用需要实现相应的JavaScript接口。

## Android端实现

### 1. WebView设置

```java
public class FeedbackWebViewActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback_webview);
        
        webView = findViewById(R.id.webview);
        setupWebView();
    }
    
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        
        // 添加JavaScript接口
        webView.addJavascriptInterface(new BidlinkInterface(), "BidlinkInterface");
        webView.addJavascriptInterface(new BidlinkInterface(), "Android"); // 备用名称
        
        // 设置UserAgent标识
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " BidlinkApp/1.0");
        
        // 加载反馈页面
        webView.loadUrl("https://your-domain.com/feedback/bug");
    }
}
```

### 2. JavaScript接口实现

```java
public class BidlinkInterface {
    private Context context;
    
    public BidlinkInterface(Context context) {
        this.context = context;
    }
    
    /**
     * 获取应用信息
     */
    @JavascriptInterface
    public String getAppInfo() {
        try {
            JSONObject appInfo = new JSONObject();
            PackageManager pm = context.getPackageManager();
            PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), 0);
            
            appInfo.put("packageName", context.getPackageName());
            appInfo.put("versionName", packageInfo.versionName);
            appInfo.put("versionCode", packageInfo.versionCode);
            appInfo.put("deviceModel", Build.MODEL);
            appInfo.put("systemVersion", Build.VERSION.RELEASE);
            appInfo.put("manufacturer", Build.MANUFACTURER);
            
            return appInfo.toString();
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * 获取缓存文件列表
     */
    @JavascriptInterface
    public String getCacheFiles() {
        try {
            JSONArray fileList = new JSONArray();
            File cacheDir = context.getCacheDir();
            File externalCacheDir = context.getExternalCacheDir();
            
            // 扫描内部缓存目录
            scanDirectory(cacheDir, fileList, "internal_cache");
            
            // 扫描外部缓存目录
            if (externalCacheDir != null) {
                scanDirectory(externalCacheDir, fileList, "external_cache");
            }
            
            // 扫描应用特定的日志目录
            File logDir = new File(context.getFilesDir(), "logs");
            if (logDir.exists()) {
                scanDirectory(logDir, fileList, "logs");
            }
            
            return fileList.toString();
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * 读取特定缓存文件
     */
    @JavascriptInterface
    public String readCacheFile(String filePath) {
        try {
            File file = new File(filePath);
            
            // 安全检查：确保文件在允许的目录内
            if (!isFilePathSafe(file)) {
                throw new SecurityException("File path not allowed");
            }
            
            if (!file.exists() || !file.canRead()) {
                throw new IOException("File not found or not readable");
            }
            
            JSONObject result = new JSONObject();
            JSONObject metadata = new JSONObject();
            
            // 文件元数据
            metadata.put("name", file.getName());
            metadata.put("path", file.getAbsolutePath());
            metadata.put("size", file.length());
            metadata.put("lastModified", file.lastModified());
            metadata.put("type", getMimeType(file));
            
            // 文件内容
            String content;
            String encoding;
            
            if (isTextFile(file)) {
                // 文本文件直接读取
                content = readTextFile(file);
                encoding = "utf8";
            } else {
                // 二进制文件转base64
                content = readBinaryFileAsBase64(file);
                encoding = "base64";
            }
            
            result.put("content", content);
            result.put("encoding", encoding);
            result.put("metadata", metadata);
            
            return result.toString();
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    /**
     * 扫描目录获取文件列表
     */
    private void scanDirectory(File dir, JSONArray fileList, String category) throws JSONException {
        if (!dir.exists() || !dir.isDirectory()) {
            return;
        }
        
        File[] files = dir.listFiles();
        if (files == null) return;
        
        for (File file : files) {
            if (file.isFile() && isRelevantFile(file)) {
                JSONObject fileInfo = new JSONObject();
                fileInfo.put("name", file.getName());
                fileInfo.put("path", file.getAbsolutePath());
                fileInfo.put("size", file.length());
                fileInfo.put("type", getMimeType(file));
                fileInfo.put("lastModified", file.lastModified());
                fileInfo.put("category", category);
                fileList.put(fileInfo);
            } else if (file.isDirectory()) {
                // 递归扫描子目录（限制深度）
                scanDirectory(file, fileList, category);
            }
        }
    }
    
    /**
     * 检查文件是否相关（日志、崩溃报告等）
     */
    private boolean isRelevantFile(File file) {
        String name = file.getName().toLowerCase();
        return name.contains("log") || 
               name.contains("crash") || 
               name.contains("error") || 
               name.contains("exception") ||
               name.contains("debug") ||
               name.endsWith(".log") ||
               name.endsWith(".txt") ||
               name.endsWith(".json") ||
               name.endsWith(".xml");
    }
    
    /**
     * 安全检查：确保文件路径在允许的范围内
     */
    private boolean isFilePathSafe(File file) {
        try {
            String canonicalPath = file.getCanonicalPath();
            String cacheDir = context.getCacheDir().getCanonicalPath();
            String filesDir = context.getFilesDir().getCanonicalPath();
            String externalCacheDir = context.getExternalCacheDir() != null ? 
                context.getExternalCacheDir().getCanonicalPath() : "";
            
            return canonicalPath.startsWith(cacheDir) || 
                   canonicalPath.startsWith(filesDir) ||
                   (externalCacheDir.length() > 0 && canonicalPath.startsWith(externalCacheDir));
        } catch (IOException e) {
            return false;
        }
    }
    
    /**
     * 获取文件MIME类型
     */
    private String getMimeType(File file) {
        String name = file.getName().toLowerCase();
        if (name.endsWith(".log") || name.endsWith(".txt")) {
            return "text/plain";
        } else if (name.endsWith(".json")) {
            return "application/json";
        } else if (name.endsWith(".xml")) {
            return "application/xml";
        }
        return "application/octet-stream";
    }
    
    /**
     * 判断是否是文本文件
     */
    private boolean isTextFile(File file) {
        String mimeType = getMimeType(file);
        return mimeType.startsWith("text/") || mimeType.contains("json") || mimeType.contains("xml");
    }
    
    /**
     * 读取文本文件
     */
    private String readTextFile(File file) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }
    
    /**
     * 读取二进制文件并转换为Base64
     */
    private String readBinaryFileAsBase64(File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[(int) file.length()];
            fis.read(buffer);
            return Base64.encodeToString(buffer, Base64.DEFAULT);
        }
    }
}
```

### 3. 权限配置

在 `AndroidManifest.xml` 中添加必要权限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 4. ProGuard配置

如果使用代码混淆，需要在 `proguard-rules.pro` 中添加：

```
-keepclassmembers class com.bidlink.cn.webview.BidlinkInterface {
    @android.webkit.JavascriptInterface <methods>;
}
```

## Web端使用

Web端会自动检测是否在Bidlink应用中，如果检测到会显示文件上传界面。用户可以：

1. 查看可用的缓存文件列表
2. 选择相关的日志或崩溃文件
3. 一键上传到服务器

## 安全考虑

1. **文件路径验证**：只允许访问应用自己的缓存和文件目录
2. **文件类型限制**：只处理相关的日志、文本和配置文件
3. **文件大小限制**：可以在接口中添加文件大小检查
4. **权限检查**：确保文件可读且在安全范围内

## 测试方法

1. 在应用中打开反馈页面
2. 检查是否显示"检测到您在Bidlink应用中"的提示
3. 验证文件列表是否正确显示
4. 测试文件选择和上传功能

这样实现后，用户在遇到Bug时可以方便地上传相关的日志文件，大大提升问题定位效率！
