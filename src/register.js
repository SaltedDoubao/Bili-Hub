// 导入用户服务模块
import { registerUser } from './userService.js';

window.addEventListener('DOMContentLoaded', (event) => {
    // 获取注册表单元素
    const registerForm = document.getElementById('registerForm');
    const messageArea = document.querySelector('.message-area');
    
    // 表单提交处理
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单默认提交
            
            // 获取表单值
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const nickname = document.getElementById('nickname').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // 表单验证
            if (!validateForm(username, password, confirmPassword, email)) {
                return;
            }
            
            // 显示处理中消息
            showMessage('处理中...', 'info');
            
            // 禁用提交按钮
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            
            // 创建用户数据对象
            const userData = {
                username,
                password,
                nickname: nickname || username, // 如果没有设置昵称，使用用户名
                email
            };
            
            // 调用注册函数
            setTimeout(() => {
                const result = registerUser(userData);
                
                // 重新启用提交按钮
                submitBtn.disabled = false;
                
                if (result.success) {
                    // 注册成功
                    showMessage('注册成功！正在跳转到登录页面...', 'success');
                    
                    // 延迟跳转到登录页
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                } else {
                    // 注册失败
                    showMessage(result.message, 'error');
                }
            }, 1000);
        });
    }
    
    // 表单验证函数
    function validateForm(username, password, confirmPassword, email) {
        // 用户名验证
        if (username.length < 3 || username.length > 20) {
            showMessage('用户名长度应为3-20个字符', 'error');
            return false;
        }
        
        // 密码验证
        if (password.length < 6) {
            showMessage('密码长度应不少于6个字符', 'error');
            return false;
        }
        
        // 确认密码验证
        if (password !== confirmPassword) {
            showMessage('两次输入的密码不一致', 'error');
            return false;
        }
        
        // 邮箱验证（如果提供）
        if (email && !validateEmail(email)) {
            showMessage('请输入有效的邮箱地址', 'error');
            return false;
        }
        
        return true;
    }
    
    // 邮箱格式验证
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // 显示消息函数
    function showMessage(message, type = 'info') {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        
        // 如果不是持续显示的信息，设置自动消失
        if (type !== 'info') {
            setTimeout(() => {
                messageArea.textContent = '';
                messageArea.className = 'message-area';
            }, 5000);
        }
    }
}); 