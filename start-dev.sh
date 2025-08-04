#!/bin/sh
echo "🔑 正在设置 SSH Agent..."
# 确保 SSH 目录权限正确
chmod 700 /root/.ssh
if [ -f /root/.ssh/NeoPorcoDev ]; then
  chmod 600 /root/.ssh/NeoPorcoDev
  eval "$(ssh-agent -s)" > /dev/null
  ssh-add /root/.ssh/NeoPorcoDev 2>/dev/null
  echo "✅ SSH 密钥已自动加载"
else
  echo "⚠️  SSH 密钥不存在，请手动设置"
fi
# 添加 GitHub 到 known_hosts（如果还没有）
if ! grep -q "github.com" /root/.ssh/known_hosts 2>/dev/null; then
  ssh-keyscan github.com >> /root/.ssh/known_hosts 2>/dev/null
fi
echo "🚀 启动开发服务器..."
exec npm run dev
