# 开发环境快速启动指南

## 👋 欢迎新同事！

### 🚀 快速开始（推荐方式）

#### 方法1：Dev Container（5分钟搞定）
1. 确保安装了 Docker Desktop 和 VS Code
2. 安装 VS Code 扩展：`Dev Containers`
3. 克隆项目：`git clone <repo-url>`
4. VS Code 打开项目文件夹
5. 点击弹出的"在容器中重新打开"提示
6. ☕ 等待自动构建完成（首次需要几分钟）
7. 🎉 自动打开 http://localhost:3001

#### 方法2：Docker Compose 开发模式
```bash
# 克隆项目
git clone <repo-url>
cd <project-folder>

# 启动开发环境
docker-compose -f docker-compose.dev.yml up --build

# 访问应用
open http://localhost:3001
```

### 🛠️ 开发工作流

- **代码修改**：直接在 VS Code 中编辑，支持热重载
- **安装依赖**：在容器终端中运行 `npm install <package>`
- **运行测试**：`npm test`
- **构建生产版本**：`npm run build`

### 📁 项目结构
```
src/
├── app/          # Next.js App Router
├── components/   # React 组件
├── contexts/     # React Context
├── config/       # 配置文件
└── utils/        # 工具函数
```

### 🎯 开发端口
- **应用服务器**: http://localhost:3001
- **Next.js 开发服务器**: 支持热重载

### ❓ 常见问题

**Q: 第一次启动很慢？**
A: 正常，Docker 需要下载基础镜像和安装依赖，后续会很快

**Q: 代码修改不生效？**
A: 检查是否使用了 Dev Container 或开发模式的 docker-compose

**Q: 端口被占用？**
A: 修改 docker-compose 中的端口映射 `"3001:3001"` → `"3002:3001"`

### 📞 需要帮助？
联系 [你的联系方式]
