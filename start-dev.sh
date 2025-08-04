#!/bin/sh
echo "🔑 正在设置 SSH Agent..."

# 创建一个临时的 SSH 目录（因为 /root/.ssh 是只读的）
TEMP_SSH_DIR="/tmp/.ssh"
mkdir -p "$TEMP_SSH_DIR"
chmod 700 "$TEMP_SSH_DIR"

if [ -f /root/.ssh/NeoPorcoDev ]; then
  echo "📋 SSH 密钥文件存在，正在复制到临时目录..."
  
  # 复制密钥到临时目录并设置正确权限
  cp /root/.ssh/NeoPorcoDev "$TEMP_SSH_DIR/NeoPorcoDev"
  chmod 600 "$TEMP_SSH_DIR/NeoPorcoDev"
  
  # 如果有 known_hosts，也复制过来
  if [ -f /root/.ssh/known_hosts ]; then
    cp /root/.ssh/known_hosts "$TEMP_SSH_DIR/known_hosts"
  fi
  
  # 启动 SSH Agent 并导出环境变量
  eval "$(ssh-agent -s)"
  
  # 将 SSH Agent 环境变量写入文件，供其他终端会话使用
  echo "export SSH_AUTH_SOCK=\"$SSH_AUTH_SOCK\"" > /tmp/ssh-agent-env
  echo "export SSH_AGENT_PID=\"$SSH_AGENT_PID\"" >> /tmp/ssh-agent-env
  chmod 600 /tmp/ssh-agent-env
  
  # 添加密钥
  ssh-add "$TEMP_SSH_DIR/NeoPorcoDev"
  
  if [ $? -eq 0 ]; then
    echo "✅ SSH 密钥已自动加载"
    echo "🔍 当前已加载的密钥:"
    ssh-add -l
  else
    echo "❌ SSH 密钥加载失败"
  fi
  
  # 测试 GitHub 连接
  echo "🧪 测试 GitHub SSH 连接..."
  ssh -o BatchMode=yes -o ConnectTimeout=5 -T git@github.com 2>&1 | head -3
  
  # 将环境变量添加到 .bashrc 和 .profile，这样新的终端会话会自动加载
  echo "" >> /root/.bashrc
  echo "# Auto-load SSH Agent environment" >> /root/.bashrc
  echo "if [ -f /tmp/ssh-agent-env ]; then" >> /root/.bashrc
  echo "  source /tmp/ssh-agent-env" >> /root/.bashrc
  echo "fi" >> /root/.bashrc
  
  echo "💡 SSH环境已配置，新终端会话会自动加载SSH认证"
  
else
  echo "⚠️  SSH 密钥不存在: /root/.ssh/NeoPorcoDev"
  echo "📁 当前 .ssh 目录内容:"
  ls -la /root/.ssh/ 2>/dev/null || echo "目录不存在"
fi

# 添加 GitHub 到临时 known_hosts（如果还没有）
if ! grep -q "github.com" "$TEMP_SSH_DIR/known_hosts" 2>/dev/null; then
  echo "📡 添加 GitHub 到 known_hosts..."
  ssh-keyscan github.com >> "$TEMP_SSH_DIR/known_hosts" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ GitHub known_hosts 已添加"
  else
    echo "⚠️  添加 GitHub known_hosts 失败"
  fi
fi

echo "🚀 启动开发服务器..."
exec npm run dev
