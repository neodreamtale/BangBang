# Docker 零基础部署教程

## 🎯 什么是 Docker？

Docker 是一个容器化平台，可以把你的应用程序和所有依赖项打包到一个轻量级、可移植的容器中。

### 🏠 类比理解
想象你要搬家：
- **传统部署** = 每次搬家都要重新买家具、装修，很麻烦
- **Docker 部署** = 把整个装修好的房间装进一个"集装箱"，到哪都能直接使用

## 🚀 为什么要用 Docker？

1. **环境一致性** - 在任何地方都能运行，不会出现"在我电脑上能跑"的问题
2. **部署简单** - 一个命令就能启动整个应用
3. **隔离性** - 不会影响服务器上的其他应用
4. **扩展性** - 需要更多实例时可以快速复制

## 📁 你的项目 Docker 化文件解析

### 1. Dockerfile - 应用程序的"装修图纸"

```dockerfile
# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine AS base

# 安装依赖所需的包
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建后的文件
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**这个文件做了什么？**
1. **第一阶段 (base)** - 设置基础环境（Node.js 18）
2. **第二阶段 (deps)** - 安装生产依赖
3. **第三阶段 (builder)** - 构建你的 Next.js 应用
4. **第四阶段 (runner)** - 创建最终的运行镜像

### 2. .dockerignore - 打包时忽略的文件

```ignore
# 这些文件不会被打包到 Docker 镜像中
node_modules     # 依赖包（会重新安装）
.next/          # 构建输出（会重新构建）
.git/           # Git 历史记录
logs/           # 日志文件
learn/          # 学习文档
*.log           # 日志文件
```

### 3. docker-compose.yml - 服务编排文件

```yaml
version: '3.8'

services:
  punch-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: punch-feedback-app
    ports:
      - "3000:3000"    # 映射端口：主机3000 -> 容器3000
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    restart: unless-stopped
```

## 🔧 Docker 安装步骤

### Windows 系统

1. **下载 Docker Desktop**
   - 访问：https://www.docker.com/products/docker-desktop/
   - 点击 "Download for Windows"

2. **安装 Docker Desktop**
   - 运行下载的安装程序
   - 选择 "Use WSL 2 instead of Hyper-V"（推荐）
   - 完成安装后重启电脑

3. **启动 Docker Desktop**
   - 桌面上找到 Docker Desktop 图标
   - 双击启动，等待 Docker 引擎启动完成

4. **验证安装**
   ```bash
   docker --version
   docker compose version
   ```

## 🚀 部署你的项目

### 方法一：使用我提供的部署脚本

1. **运行部署脚本**
   ```bash
   # Windows
   ./deploy.bat
   
   # 这个脚本会自动：
   # 1. 构建 Docker 镜像
   # 2. 停止旧容器
   # 3. 启动新容器
   # 4. 显示运行状态
   ```

### 方法二：手动执行 Docker 命令

1. **构建镜像**
   ```bash
   docker build -t punch-feedback-app .
   
   # 解释：
   # docker build  = 构建镜像命令
   # -t           = 给镜像起个名字
   # .            = 使用当前目录的 Dockerfile
   ```

2. **运行容器**
   ```bash
   docker run -d --name punch-app -p 3000:3000 punch-feedback-app
   
   # 解释：
   # docker run   = 运行容器命令
   # -d          = 后台运行
   # --name      = 给容器起个名字
   # -p 3000:3000 = 端口映射（主机:容器）
   ```

3. **查看运行状态**
   ```bash
   docker ps
   ```

### 方法三：使用 Docker Compose（推荐）

```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📊 Docker 常用管理命令

### 容器管理
```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop punch-app

# 启动容器
docker start punch-app

# 重启容器
docker restart punch-app

# 删除容器
docker rm punch-app
```

### 镜像管理
```bash
# 查看所有镜像
docker images

# 删除镜像
docker rmi punch-feedback-app

# 清理未使用的镜像
docker image prune -f
```

### 日志查看
```bash
# 查看容器日志
docker logs punch-app

# 实时查看日志
docker logs -f punch-app

# 查看最近50行日志
docker logs --tail 50 punch-app
```

### 进入容器调试
```bash
# 进入正在运行的容器
docker exec -it punch-app /bin/sh

# 在容器内执行命令
docker exec punch-app ls -la
```

## 🔧 你的项目特殊配置

### 1. Next.js 配置 (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',  // 为 Docker 部署优化
  images: {
    unoptimized: true   // 简化图片处理
  }
};
```

### 2. 调试功能保留
- 你的 Bidlink 调试面板在 Docker 容器中仍然可用
- 开发环境的调试命令会自动禁用

### 3. 环境变量
容器会自动设置：
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000`

## 🌐 访问你的应用

部署成功后：
1. 打开浏览器
2. 访问：http://localhost:3000
3. 你会看到你的反馈应用界面

## 🛠️ 故障排除

### 问题1：Docker 命令不识别
```bash
# 错误：docker : 无法将"docker"项识别为 cmdlet
# 解决：确保 Docker Desktop 已启动
```

### 问题2：端口被占用
```bash
# 错误：port is already allocated
# 解决：停止占用端口的程序
docker stop $(docker ps -q --filter "publish=3000")
```

### 问题3：构建失败
```bash
# 查看详细错误信息
docker build -t punch-feedback-app . --no-cache

# 查看构建日志
docker build -t punch-feedback-app . --progress=plain
```

### 问题4：容器无法启动
```bash
# 查看容器日志
docker logs punch-app

# 检查容器状态
docker inspect punch-app
```

## 📈 进阶使用

### 1. 多环境部署
```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### 2. 数据持久化
```yaml
services:
  punch-app:
    volumes:
      - ./logs:/app/logs  # 日志文件持久化
```

### 3. 健康检查
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
```

## 🎉 总结

现在你的项目已经 Docker 化了！你可以：

1. **一键部署** - `./deploy.bat` 搞定一切
2. **环境一致** - 在任何支持 Docker 的机器上运行
3. **易于管理** - 用简单的 Docker 命令管理应用
4. **快速扩展** - 需要时可以运行多个实例

Docker 让部署变得像安装软件一样简单！🚀
