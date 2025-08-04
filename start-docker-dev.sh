#!/bin/sh

echo "🐳 Docker 开发环境启动脚本"
echo "=============================="

# 检查 SSH 密钥是否存在
if [ -f ~/.ssh/NeoPorcoDev ]; then
    echo "✅ 检测到 SSH 密钥，将自动挂载到容器"
else
    echo "⚠️  未检测到 SSH 密钥 ~/.ssh/NeoPorcoDev"
    echo "   容器内将跳过 SSH 配置"
fi

echo "🚀 启动 Docker 开发环境..."
docker-compose -f docker-compose.dev.yml up --build
