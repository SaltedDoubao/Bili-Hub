@echo off
echo ��������LM Studio API��CORS���������...
echo.
echo �˴��������ڼ�����رգ�
echo.
echo �������ӵ� http://127.0.0.1:1234 ���ڶ˿� 8010 ���ṩ����
echo ��ҳӦ�ó���Ӧ�����ӵ� http://localhost:8010/proxy
echo.
echo �� Ctrl+C ��ֹͣ���������...
echo.

:: ����Ƿ�װ��local-cors-proxy
npx local-cors-proxy -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ���ڰ�װlocal-cors-proxy...
    npm install -g local-cors-proxy
)

:: ��������
npx local-cors-proxy --proxyUrl http://127.0.0.1:1234 --port 8010 