# 🎬 Docker 部署演示步骤

## 第一步：安装 Docker Desktop

1. 访问 https://www.docker.com/products/docker-desktop/
2. 下载并安装 Docker Desktop for Windows
3. 重启电脑
4. 启动 Docker Desktop（桌面图标）

## 第二步：验证 Docker 安装

打开 PowerShell 或命令行：

```bash
# 检查 Docker 版本
docker --version
# 应该显示类似：Docker version 24.0.7, build afdd53b

# 检查 Docker Compose 版本  
docker compose version
# 应该显示类似：Docker Compose version v2.21.0
```

## 第三步：进入项目目录

```bash
# 进入你的项目文件夹
cd "d:\ProjectNewRepo\BangBang\punch"

# 确认文件存在
dir Dockerfile
dir docker-compose.yml
```

## 第四步：一键部署

### 🚀 方法一：使用我写的脚本（最简单）

```bash
# Windows 下直接双击运行
deploy.bat

# 或在命令行中运行
./deploy.bat
```

脚本会自动完成：
1. 🔨 构建 Docker 镜像
2. 🛑 停止旧容器（如果有）
3. ▶️ 启动新容器
4. ✅ 显示部署结果

### 🛠️ 方法二：手动执行（理解原理）

```bash
# 1. 构建镜像（第一次会比较慢，下载 Node.js 环境）
docker build -t punch-feedback-app .

# 2. 运行容器
docker run -d --name punch-app -p 3000:3000 punch-feedback-app

# 3. 查看状态
docker ps
```

### 🎯 方法三：使用 Docker Compose（推荐生产环境）

```bash
# 一条命令启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f punch-app
```

## 第五步：验证部署成功

1. **打开浏览器**
2. **访问**：http://localhost:3000
3. **应该看到**：你的反馈应用首页

## 第六步：测试调试功能

1. **按 F12 打开开发者工具**
2. **切换到控制台**
3. **运行调试命令**：
   ```javascript
   toggleBidlinkDebugPanel()
   enableBidlinkDebugMode()
   ```
4. **应该看到**：调试面板出现在页面右下角

## 📊 常用管理命令

```bash
# 查看运行状态
docker ps

# 查看应用日志
docker logs punch-app

# 重启应用
docker restart punch-app

# 停止应用
docker stop punch-app

# 完全清理（停止并删除容器）
docker stop punch-app && docker rm punch-app
```

## 🎉 成功标志

如果你看到以下内容，说明部署成功：

1. ✅ Docker 命令能正常运行
2. ✅ `docker ps` 显示 punch-app 容器在运行
3. ✅ 浏览器能访问 http://localhost:3000
4. ✅ 调试面板能正常显示和使用
5. ✅ 应用功能正常（可以进入各个反馈页面）

## 🆘 如果遇到问题

### Docker 命令不识别
- 确保 Docker Desktop 已启动（系统托盘有 Docker 图标）
- 重启 PowerShell 或命令行

### 端口被占用
```bash
# 查看占用 3000 端口的程序
netstat -ano | findstr :3000

# 停止占用端口的 Docker 容器
docker stop $(docker ps -q --filter "publish=3000")
```

### 构建失败
```bash
# 查看详细构建日志
docker build -t punch-feedback-app . --progress=plain --no-cache
```

### 容器启动失败
```bash
# 查看容器错误日志
docker logs punch-app

# 进入容器调试
docker exec -it punch-app /bin/sh
```

恭喜！你已经掌握了 Docker 部署的基本流程！🎊
