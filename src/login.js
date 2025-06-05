// 导入用户服务模块
import { loginUser } from './userService.js';

window.addEventListener('DOMContentLoaded', (event) => {
    // 获取登录表单元素
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.querySelector('.extra-links a');
    
    // 错误消息显示区域
    let messageArea = document.querySelector('.message-area');
    if (!messageArea) {
        messageArea = document.createElement('div');
        messageArea.className = 'message-area';
        document.querySelector('.login-box').insertBefore(messageArea, loginForm);
    }
    
    // 注册链接点击事件
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './register.html';
        });
    }
    
    // 表单提交事件
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单的默认提交行为

            // 获取用户名输入框的值
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value.trim(); // trim()去除首尾空格
            
            // 获取密码输入框的值
            const passwordInput = document.getElementById('password');
            const password = passwordInput.value.trim();

            // 前端基础验证
            if (username === "") {
                showMessage('请输入用户名！', 'error');
                usernameInput.focus();
                return;
            }
            
            if (password === "") {
                showMessage('请输入密码！', 'error');
                passwordInput.focus();
                return;
            }
            
            // 显示登录中...
            showMessage('登录中...', 'info');
            
            // 禁用提交按钮，防止重复提交
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            
            // 调用登录验证函数
            const result = loginUser(username, password);
            
            // 延迟处理登录结果，模拟网络请求
            setTimeout(() => {
                // 重新启用提交按钮
                submitBtn.disabled = false;
                
                if (result.success) {
                    // 登录成功
                    showMessage('登录成功，正在跳转...', 'success');
                    
                    // 存储用户信息到localStorage
                    localStorage.setItem('biliHubUser', username);
                    localStorage.setItem('biliHubUserInfo', JSON.stringify(result.user));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    // 延迟跳转到首页
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1000);
                } else {
                    // 登录失败
                    showMessage(result.message, 'error');
                }
            }, 800);
        });
    }
    
    // 显示消息函数
    function showMessage(message, type = 'info') {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        
        // 自动清除消息
        if (type !== 'info') {
            setTimeout(() => {
                messageArea.textContent = '';
                messageArea.className = 'message-area';
            }, 5000);
        }
    }
});