# 环境信息自动检测功能

## 功能说明

该功能可以自动检测用户的浏览器和系统环境信息，无需用户手动填写。支持以下场景：

### 1. 浏览器环境检测
- **浏览器类型和版本**: Chrome, Firefox, Safari, Edge等
- **操作系统**: Windows, macOS, Linux, iOS, Android等
- **屏幕信息**: 分辨率和像素密度
- **语言和时区**: 用户的语言偏好和时区设置

### 2. WebView环境检测
- **Android WebView**: 自动识别安卓应用内WebView
- **iOS WebView**: 自动识别iOS应用内WebView
- **微信/QQ/支付宝**: 识别常见的第三方应用WebView

### 3. 原生应用集成支持

#### Android原生接口示例

在安卓应用中，您可以通过以下方式注入JavaScript接口：

```java
// Android WebView 设置
webView.addJavascriptInterface(new AndroidInterface(), "AndroidInterface");

public class AndroidInterface {
    @JavascriptInterface
    public String getDeviceInfo() {
        JSONObject deviceInfo = new JSONObject();
        try {
            deviceInfo.put("deviceModel", Build.MODEL);
            deviceInfo.put("systemVersion", Build.VERSION.RELEASE);
            deviceInfo.put("appVersion", getAppVersion());
            deviceInfo.put("deviceId", getDeviceId());
            // 添加更多设备信息...
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return deviceInfo.toString();
    }
}
```

#### iOS原生接口示例

在iOS应用中，您可以通过WKWebView的消息处理器：

```swift
// iOS WKWebView 配置
let userController = WKUserContentController()
userController.add(self, name: "iosInterface")

let config = WKWebViewConfiguration()
config.userContentController = userController

// 消息处理
func userContentController(_ userContentController: WKUserContentController, 
                          didReceive message: WKScriptMessage) {
    if message.name == "iosInterface" {
        if let body = message.body as? [String: Any],
           let action = body["action"] as? String,
           action == "getDeviceInfo" {
            
            let deviceInfo = [
                "deviceModel": UIDevice.current.model,
                "systemVersion": UIDevice.current.systemVersion,
                "appVersion": getAppVersion(),
                // 添加更多设备信息...
            ]
            
            // 将信息返回给WebView
            let script = "window.nativeDeviceInfo = \\(deviceInfo)"
            webView.evaluateJavaScript(script)
        }
    }
}
```

#### React Native WebView

如果使用React Native WebView：

```javascript
// React Native 端
const injectedJavaScript = \`
  window.ReactNativeWebView = {
    postMessage: function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
  };
  true;
\`;

<WebView
  source={{ uri: 'https://your-web-app.com' }}
  injectedJavaScript={injectedJavaScript}
  onMessage={(event) => {
    const data = JSON.parse(event.nativeEvent.data);
    // 处理来自WebView的消息
  }}
/>
```

### 4. 检测到的信息格式

自动检测的环境信息包含：

```
Chrome 120 | Android 13 | 屏幕: 1080x2400 (3x) | 语言: zh-CN | 时区: Asia/Shanghai | WebView: Android WebView
```

### 5. 优势

1. **用户体验优化**: 用户无需手动填写复杂的技术信息
2. **信息准确性**: 避免用户填写错误或不完整的环境信息
3. **开发效率**: 减少错误排查时间，提供准确的环境上下文
4. **扩展性强**: 支持原生应用注入额外的设备信息

### 6. 兼容性

- ✅ 所有现代浏览器 (Chrome, Firefox, Safari, Edge)
- ✅ 移动端浏览器
- ✅ Android WebView
- ✅ iOS WebView
- ✅ 微信/QQ/支付宝等第三方WebView
- ✅ React Native WebView
- ✅ Flutter WebView

这个功能大大提升了反馈系统的用户体验和开发效率！
