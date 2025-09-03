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

run_migrations() {
  docker run --rm \
    -v $(pwd):/app \
    -v /app/programs/BangBang/prod.db:/app/prod.db \
    -w /app \
    -e DATABASE_URL=file:/app/prod.db \
    node:22-alpine \
    sh -c "apk add --no-cache libc6-compat python3 make g++ && npm ci --production && npx prisma migrate deploy"
}

# Only run migrations in non-development (production-like) environments
if [ "$ENVIRONMENT" != "development" ]; then
  echo "📦 在生产环境运行 prisma migrate deploy（短期 node 容器）..."
  # Backup prod.db if present
  if [ -f /app/programs/BangBang/prod.db ]; then
    cp /app/programs/BangBang/prod.db /app/programs/BangBang/prod.db.bak.$(date +%s)
    echo "🔒 已备份 /app/programs/BangBang/prod.db"
  else
    echo "⚠️ /app/programs/BangBang/prod.db 未找到，迁移将对空数据库执行（请确认）"
  fi

  if run_migrations; then
    echo "✅ 数据库迁移完成"
  else
    echo "❌ 数据库迁移失败" >&2
    exit 1
  fi
else
  echo "跳过迁移（development 环境）"
fi

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
    --env-file /app/programs/BangBang/.env.production \
    -e DATABASE_URL=file:/app/prod.db \
    -v /app/programs/BangBang/prod.db:/app/prod.db \
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
