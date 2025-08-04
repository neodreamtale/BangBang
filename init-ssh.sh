#!/bin/sh

echo "🔑 初始化 SSH 密钥到 Docker Volume..."

# 启动临时容器来设置 SSH 密钥
docker-compose -f docker-compose.dev.yml run --rm punch-app-dev sh -c "
echo '🔧 设置 SSH 环境...'

# 复制当前容器的 SSH 密钥到 Volume
if [ -f /root/.ssh/NeoPorcoDev ]; then
    echo '✅ 发现现有 SSH 密钥，已保存到 Volume'
    chmod 600 /root/.ssh/NeoPorcoDev
    chmod 644 /root/.ssh/NeoPorcoDev.pub 2>/dev/null
    chmod 700 /root/.ssh
    echo '✅ SSH 密钥权限已设置'
else
    echo '❌ 未找到 SSH 密钥 /root/.ssh/NeoPorcoDev'
    echo '请先将密钥复制到容器的 /root/.ssh/ 目录'
fi

# 添加 GitHub 到 known_hosts
if ! grep -q 'github.com' /root/.ssh/known_hosts 2>/dev/null; then
    ssh-keyscan github.com >> /root/.ssh/known_hosts
    echo '✅ GitHub 主机密钥已添加'
fi

echo '🎉 SSH 环境初始化完成！'
"

echo "📋 使用说明："
echo "1. 现在可以运行: docker-compose -f docker-compose.dev.yml up"
echo "2. SSH 密钥将通过 Docker Volume 在容器重启间保持持久化"
echo "3. 每次启动容器都会自动设置 SSH Agent"
