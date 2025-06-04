@echo off
echo 正在启动LM Studio API的CORS代理服务器...
echo.
echo 此窗口运行期间请勿关闭！
echo.
echo 代理将连接到 http://127.0.0.1:1234 并在端口 8010 上提供服务
echo 网页应用程序应该连接到 http://localhost:8010/proxy
echo.
echo 按 Ctrl+C 可停止代理服务器...
echo.

:: 检查是否安装了local-cors-proxy
npx local-cors-proxy -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装local-cors-proxy...
    npm install -g local-cors-proxy
)

:: 启动代理
npx local-cors-proxy --proxyUrl http://127.0.0.1:1234 --port 8010 