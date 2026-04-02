#!/bin/bash
# 生产环境启动脚本

# 设置工作目录
cd /root/.openclaw/workspace/OpenClaw-Workspace

# 加载环境变量，并设置数据库绝对路径
export DATABASE_URL="file:/root/.openclaw/workspace/OpenClaw-Workspace/openclaw.db"
export $(grep -v '^#' .env | grep -v '^DATABASE_URL' | xargs)

# 启动生产服务器
exec node .output/server/index.mjs
