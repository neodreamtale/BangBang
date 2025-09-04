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

echo "🔨 构建 Docker 镜像..."
docker build -t $IMAGE_NAME:latest .

# Host directory that will contain prod.db (adjust if your host uses a different path)
HOST_DB_PARENT=${HOST_DB_PARENT:-/app/programs/BangBang}

# ensure parent exists
mkdir -p "$HOST_DB_PARENT"

# Safety checks: abort if prod.db is a directory or a mount point on the host
if [ -d "$HOST_DB_PARENT/prod.db" ]; then
  echo "ERROR: $HOST_DB_PARENT/prod.db is a directory on the host. Expected a file. Aborting."
  exit 1
fi

if [ -r /proc/mounts ] && grep -q " $HOST_DB_PARENT/prod.db " /proc/mounts; then
  echo "ERROR: $HOST_DB_PARENT/prod.db appears in /proc/mounts (a mount point). Unmount or choose another path. Aborting."
  exit 1
fi

# Create the DB file atomically if it doesn't exist and set ownership/permissions for UID 1001
if [ ! -f "$HOST_DB_PARENT/prod.db" ]; then
  echo "Creating $HOST_DB_PARENT/prod.db ..."
  # install is atomic and sets owner/mode in one step (requires root)
  install -o 1001 -g 1001 -m 660 /dev/null "$HOST_DB_PARENT/prod.db"
fi

# Normalize permisssions on parent dir
chown 1001:1001 "$HOST_DB_PARENT" 2>/dev/null || true
chmod 750 "$HOST_DB_PARENT" 2>/dev/null || true

run_migrations() {
  echo "Running migrations using a cached deps-stage helper image (faster)..."
  # Build a small helper image from the Dockerfile 'deps' stage. This will reuse Docker cache
  # across builds and avoids running `npm ci` inside a ephemeral container every deploy.
  docker build --target deps -t "$IMAGE_NAME:migrate" . >/dev/null

  docker run --rm \
    --env-file /app/programs/BangBang/.env.production \
    -v "$(pwd)":/app \
    -v "$HOST_DB_PARENT":/db \
    -w /app \
    "$IMAGE_NAME:migrate" \
    sh -c "npx prisma migrate deploy"
}

# Only run migrations in non-development (production-like) environments
if [ "$ENVIRONMENT" != "development" ]; then
  echo "📦 运行 prisma migrate deploy（生产环境）..."
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
    -v "$(pwd)":/app \
    -v /app/node_modules \
    $IMAGE_NAME:latest
else
  # 生产环境：挂载 host DB 目录到 /db 并通过 env 覆盖 DATABASE_URL
  docker run -d \
    --name $CONTAINER_NAME \
    --env-file /app/programs/BangBang/.env.production \
    -v "$HOST_DB_PARENT":/db \
    -v /app/programs/BangBang/uploads:/app/uploads \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    --restart unless-stopped \
    $IMAGE_NAME:latest
fi

# 等待应用启动并检查状态
echo "⏳ 等待应用启动..."
sleep 10

if docker ps | grep -q $CONTAINER_NAME; then
  echo "✅ 部署成功！"
  echo "📋 查看日志: docker logs $CONTAINER_NAME"
else
  echo "❌ 部署失败！查看容器日志以排查问题："
  docker logs $CONTAINER_NAME || true
  exit 1
fi
