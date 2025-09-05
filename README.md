# 摘要

本项目（Punch-BangBang）旨在为产品和客户支持团队提供一个轻量、可部署的用户反馈平台，用于集中收集 Bug 报告、功能建议和一般反馈。

关键价值：
- 提高问题响应速度：统一收集反馈并包含关键上下文（日志/设备信息），缩短从反馈到处理的时间。
- 降低沟通成本：替代分散的工单/聊天记录/邮件，提供线上的日志浏览。
- 支持产品优化决策：通过建议反馈的分类，帮助产品团队识别高影响问题与机会。

预期指标：
- 反馈处理速度（从问题反馈到复现错误及分析）提升1000%以上（视实践而定）。

需要的支持/投入：
- 基础设施：一个低成本 Linux 主机或容器环境用于部署（当前实现使用 Docker + SQLite，易于运维）。
- 权限与运维：配置持久化存储（数据库与上传目录）的挂载与备份策略。
- <span style="color: red;">业务对接</span>
  - 指定产品/支持团队的负责人接受并验证反馈流转过程。
  - 上线应需要售后团队改变目前反馈的工作流

小结：Punch-BangBang 是一套低成本、低风险的反馈平台原型，能快速交付可观的产品与改进，推荐先在小范围内试点并根据使用数据迭代。

# Punch-BangBang — 反馈收集服务技术手册

## 目录

- 概述
- 要求
- 本地开发
- 数据库 & Prisma
- Docker & 生产部署
- 环境变量
- 常见问题与排查
- 常用命令

## 概述

这是一个用于收集用户反馈（Bug / 建议 / 一般反馈）的 Next.js + Prisma 应用，使用 SQLite 作为生产数据库（可通过 bind mount 将 `prod.db` 持久化到宿主机），文件上传会被存放在 `uploads/` 目录并挂载到宿主机以实现持久化。

项目结构（部分）:

- `src/` — Next.js app 源码
- `prisma/` — Prisma schema 与迁移
- `uploads/` — 运行时上传的文件（已加入仓库示例）
- `Dockerfile` / `docker-compose*.yml` — 容器部署
- `deploy.sh` — 简化的部署脚本（参见下文）

移动端部分：
- Android：
  - 日志文件通过`com.bidlink.manager.CrashManager`管理崩溃日志并记录在本地
  - 本地地址为`/data/data/com.bidlink.xxx/cache/userId/crash_当天日期.jsonl`。
  - Punch-BangBang通过js本地app注入接口`window.support.loadCrashLogs`读取安卓本地文件
  - Punch-BangBang通过js本地app注入接口`window.support.onCrashLogUploaded`将已经上传到服务器的日志删除。

- IOS：待后续实现

## 要求

- Docker (推荐，部署时使用)
- Node.js (开发时)
- Bash（用于运行 `deploy.sh`）

开发与部署通常在 Linux 主机或支持 Docker 的环境中进行。

## 本地开发

1. 安装依赖：

```powershell
npm install
```

2. 启动开发服务器：

```powershell
npm run dev
```

3. 打开浏览器访问 http://localhost:3000

注意：仓库使用 Next.js standalone 输出和 Prisma，开发时按常规方式运行即可。

## 数据库 & Prisma

- Prisma schema 在 `prisma/schema.prisma`。
- 开发时可以使用 SQLite 文件 `prisma/dev.db`；生产使用 `prod.db`（由部署脚本或宿主机提供并挂载）。

常见 Prisma 命令：

```powershell
npx prisma generate       # 生成 Prisma Client
npx prisma migrate dev    # 在开发机器上运行迁移
npx prisma migrate deploy # 在生产环境中应用迁移（使用 deploy.sh）
```

重要说明：生产部署推荐通过 `deploy.sh` / CI 在宿主机上以短寿命容器运行 `prisma migrate deploy`，避免在每次短容器中多次 `npm ci`。

## Docker & 生产部署

项目内含 `Dockerfile` 与 `deploy.sh`：

- `deploy.sh` 会：
  - 构建镜像
  - 确保宿主机上的 DB 文件（`prod.db`）和 `uploads` 目录存在并设置合适权限
  - 运行迁移（通过从 `Dockerfile` 的 `deps` stage 构建的 helper 镜像，避免重复安装依赖）
  - 启动生产容器并通过 `--env-file` 注入环境变量

生产部署要点：

1. 避免把 `prod.db` 当作目录或被错误的 mount 覆盖（这会导致 SQLite 只读或 P1013 错误）。部署前确保宿主路径是普通目录，或修改 `HOST_DB_PARENT` 环境变量指向其它目录。
2. 确保 `HOST_UPLOADS_PARENT`（默认 `/app/programs/BangBang/uploads`）为目录并对运行容器的非 root 用户（镜像里 UID 1001）可写。`deploy.sh` 会尝试创建并 chown，但在某些受限主机上可能需要管理员权限。

举例：在主机上使用 `deploy.sh`（Linux / Bash）：

```bash
# 以生产模式运行（默认）
./deploy.sh

# 指定开发模式（跳过迁移并挂载代码以便热重载）
./deploy.sh development
```

如果你的 CI/主机需要 Windows PowerShell 风格命令，请在说明中使用相应转换（部署脚本是 Bash 脚本，建议在 Linux 主机上执行）。

## 环境变量

关键文件：`/app/programs/BangBang/.env.production`（`deploy.sh` 默认通过 `--env-file` 注入）

至少需要设置：

- `DATABASE_URL=file:/db/prod.db` （或指向你的宿主挂载路径）
- 其它 Next.js 或 Prisma 的运行时变量（例如 `NODE_ENV=production`、第三方 API keys 等）

示例 `.env.production` 片段：

```
DATABASE_URL=file:/db/prod.db
NEXT_TELEMETRY_DISABLED=1
# ...其它变量
```

## 常见问题与排查

- 问：启动后 Prisma 报 P1013 或 SQLite 报 "attempt to write a readonly database"。
  - 排查：宿主机上 `prod.db` 是否被当作挂载点或目录（不是普通文件）。运行 `cat /proc/mounts | grep prod.db` 或 `mountpoint -q /path` 检查。确保使用目录挂载并且 `prod.db` 是文件。

- 问：部署脚本无法创建 `prod.db` 或 `uploads` 目录。
  - 排查：检查运行 `deploy.sh` 的用户是否有权限在宿主路径创建文件/目录，或提前在宿主上创建并 chown 给 UID 1001（脚本使用 UID 1001 对应容器用户）。

## 常用命令

```powershell
# 安装依赖
npm ci

# 开发
npm run dev

# 构建生产镜像
docker build -t punch-feedback-app:latest .

# 使用 deploy 脚本部署（在 Linux Bash）
./deploy.sh
```

