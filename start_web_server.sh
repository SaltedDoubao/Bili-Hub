#!/bin/bash

# 定义清理函数
cleanup() {
    echo "正在停止服务器 (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# 设置捕获信号，在脚本退出时自动清理
trap cleanup SIGINT SIGTERM EXIT

echo "==========================================="
echo "Starting Python HTTP server on port 8000..."
echo "==========================================="
echo "Serving files from the current directory: $(pwd)"
echo "Make sure you run this script from your project's root folder!"
echo ""

# 在后台启动Python HTTP服务器
python3 -m http.server 8000 &
SERVER_PID=$!

echo "Waiting for server to start (approx. 3 seconds)..."
sleep 3

echo "==========================================="
echo "Opening http://localhost:8000 in browser..."
echo "==========================================="

# 尝试打开浏览器，使用多种可能的命令
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:8000/src/index.html
elif command -v gnome-open > /dev/null; then
    gnome-open http://localhost:8000/src/index.html
else
    echo "无法自动打开浏览器，请手动访问: http://localhost:8000/src/index.html"
fi

echo ""
echo "服务器正在后台运行，进程ID: $SERVER_PID"
echo "按 Ctrl+C 停止服务器并退出脚本"
echo ""

# 等待，直到用户按Ctrl+C
wait $SERVER_PID 