#!/bin/bash

# Punch 反馈应用部署脚本
# 使用方法: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
IMAGE_NAME="punch-feedback-app"
CONTAINER_NAME="punch-app"

echo "🚀 开始部署 Punch 反馈应用..."
echo "📦 环境: $ENVIRONMENT"

# 停止并删除现有容器
echo "🛑 停止现有容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 构建新镜像
echo "🔨 构建 Docker 镜像..."
docker build -t $IMAGE_NAME:latest .

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

# 运行新容器
echo "▶️ 启动新容器..."
if [ "$ENVIRONMENT" = "development" ]; then
    # 开发环境：挂载代码目录，支持热重载
    docker run -d \
        --name $CONTAINER_NAME \
        -p 3000:3000 \
        -e NODE_ENV=development \
        -v $(pwd):/app \
        -v /app/node_modules \
        $IMAGE_NAME:latest
else
    # 生产环境
    docker run -d \
        --name $CONTAINER_NAME \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e NEXT_TELEMETRY_DISABLED=1 \
        --restart unless-stopped \
        $IMAGE_NAME:latest
fi

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 10

# 检查应用状态
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ 部署成功！"
    echo "🌐 应用访问地址: http://localhost:3001"
    echo "📊 容器状态:"
    docker ps | grep $CONTAINER_NAME
    echo ""
    echo "📋 查看日志: docker logs $CONTAINER_NAME"
    echo "🛑 停止应用: docker stop $CONTAINER_NAME"
else
    echo "❌ 部署失败！"
    echo "📋 查看错误日志:"
    docker logs $CONTAINER_NAME
    exit 1
fi
