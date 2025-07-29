# 🔑 SSH 密钥配置指南

## 🎯 首次设置（每个开发者必须执行）

### 1. 生成 SSH 密钥
```bash
# 在 Dev Container 中执行
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### 2. 查看公钥
```bash
cat ~/.ssh/id_ed25519.pub
```

### 3. 添加到 GitLab
1. 复制上面命令输出的公钥
2. 登录 GitLab (`gitlab.longdaoyun.com`)
3. 用户设置 → SSH Keys → Add new key
4. 粘贴公钥并保存

### 4. 测试连接
```bash
ssh -T git@gitlab.longdaoyun.com
```

## 🔄 换电脑时
1. 在新环境重复上述步骤
2. 或者从备份恢复密钥文件

## 👥 团队成员
每个人都需要完成这个设置流程。
