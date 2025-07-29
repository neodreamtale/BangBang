# Docker 部署指南

## 🚀 快速部署

### 方法一：使用部署脚本（推荐）

#### Windows
```bash
./deploy.bat
```

#### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

### 方法二：使用 npm 脚本
```bash
# 构建并运行（开发环境）
npm run docker:dev

# 构建并运行（生产环境）
npm run docker:prod

# 查看日志
npm run docker:logs

# 停止容器
npm run docker:stop
```

### 方法三：手动 Docker 命令
```bash
# 构建镜像
docker build -t punch-feedback-app .

# 运行容器
docker run -d --name punch-app -p 3000:3000 punch-feedback-app

# 查看状态
docker ps
```

## 🔧 配置选项

### 环境变量
- `NODE_ENV`: 运行环境 (development/production)
- `NEXT_TELEMETRY_DISABLED`: 禁用 Next.js 遥测
- `PORT`: 端口号 (默认 3000)

### 端口映射
- 应用端口：`3000`
- Nginx 代理端口：`80` (可选)

## 🌐 使用 Nginx 反向代理

### 启动带 Nginx 的完整服务
```bash
docker-compose --profile proxy up -d
```

### 自定义域名
1. 修改 `nginx.conf` 中的 `server_name`
2. 配置 DNS 指向服务器 IP
3. 重启服务

### SSL/HTTPS 配置
1. 将证书文件放到 `ssl/` 目录
2. 取消注释 `nginx.conf` 中的 HTTPS 配置
3. 重启 Nginx 服务

## 📋 常用操作

### 查看日志
```bash
# 应用日志
docker logs punch-app

# Nginx 日志
docker logs punch-nginx

# 实时日志
docker logs -f punch-app
```

### 重启服务
```bash
# 重启应用
docker restart punch-app

# 重启所有服务
docker-compose restart
```

### 更新应用
```bash
# 停止服务
docker-compose down

# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### 清理资源
```bash
# 清理未使用的镜像
docker image prune -f

# 清理所有未使用的资源
docker system prune -f

# 清理项目相关容器和镜像
docker-compose down --rmi all --volumes
```

## 🛠️ 故障排除

### 应用无法启动
```bash
# 查看构建日志
docker build -t punch-feedback-app . --no-cache

# 查看运行日志
docker logs punch-app
```

### 端口被占用
```bash
# 查找占用端口的进程
netstat -tulpn | grep :3000

# 使用不同端口
docker run -p 8080:3000 punch-feedback-app
```

### 权限问题
```bash
# 确保脚本有执行权限
chmod +x deploy.sh

# 以管理员身份运行 (Windows)
# 右键 -> 以管理员身份运行
```

## 📊 监控和维护

### 健康检查
```bash
# 检查应用状态
curl http://localhost:3000

# 检查容器状态
docker ps | grep punch
```

### 资源使用
```bash
# 查看资源使用情况
docker stats punch-app

# 查看镜像大小
docker images | grep punch
```

### 备份和恢复
```bash
# 导出镜像
docker save punch-feedback-app > punch-app.tar

# 导入镜像
docker load < punch-app.tar
```

## 🔒 安全建议

1. **不要暴露调试功能到生产环境**
   - 调试面板仅在开发环境可用
   - 生产环境自动禁用调试命令

2. **使用 HTTPS**
   - 配置 SSL 证书
   - 重定向 HTTP 到 HTTPS

3. **限制访问**
   - 使用防火墙限制端口访问
   - 配置 Nginx 访问控制

4. **定期更新**
   - 定期更新基础镜像
   - 更新依赖包版本

## 🚀 生产环境建议

1. **使用 Docker Compose**
   - 便于管理多个服务
   - 配置数据卷持久化

2. **配置日志轮转**
   - 防止日志文件过大
   - 使用 logrotate 或 Docker 日志驱动

3. **设置资源限制**
   ```yaml
   services:
     punch-app:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '0.5'
   ```

4. **使用健康检查**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:3000/ || exit 1
   ```

现在你的应用已经可以用 Docker 部署了！🎉
