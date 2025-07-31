@echo off
setlocal

REM Punch 反馈应用部署脚本 (Windows)
REM 使用方法: deploy.bat [environment]

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

set IMAGE_NAME=punch-feedback-app
set CONTAINER_NAME=punch-app

echo 🚀 开始部署 Punch 反馈应用...
echo 📦 环境: %ENVIRONMENT%

REM 停止并删除现有容器
echo 🛑 停止现有容器...
docker stop %CONTAINER_NAME% 2>nul
docker rm %CONTAINER_NAME% 2>nul

REM 构建新镜像
echo 🔨 构建 Docker 镜像...
docker build -t %IMAGE_NAME%:latest .
if %ERRORLEVEL% neq 0 (
    echo ❌ 镜像构建失败！
    exit /b 1
)

REM 清理旧镜像
echo 🧹 清理旧镜像...
docker image prune -f

REM 运行新容器
echo ▶️ 启动新容器...
if "%ENVIRONMENT%"=="development" (
    REM 开发环境
    docker run -d --name %CONTAINER_NAME% -p 3001:3001 -e NODE_ENV=development %IMAGE_NAME%:latest
) else (
    REM 生产环境
    docker run -d --name %CONTAINER_NAME% -p 3001:3001 -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 --restart unless-stopped %IMAGE_NAME%:latest
)

if %ERRORLEVEL% neq 0 (
    echo ❌ 容器启动失败！
    exit /b 1
)

REM 等待应用启动
echo ⏳ 等待应用启动...
timeout /t 10 /nobreak >nul

REM 检查应用状态
docker ps | findstr %CONTAINER_NAME% >nul
if %ERRORLEVEL% equ 0 (
    echo ✅ 部署成功！
    echo 🌐 应用访问地址: http://localhost:3001
    echo 📊 容器状态:
    docker ps | findstr %CONTAINER_NAME%
    echo.
    echo 📋 查看日志: docker logs %CONTAINER_NAME%
    echo 🛑 停止应用: docker stop %CONTAINER_NAME%
) else (
    echo ❌ 部署失败！
    echo 📋 查看错误日志:
    docker logs %CONTAINER_NAME%
    exit /b 1
)

endlocal
