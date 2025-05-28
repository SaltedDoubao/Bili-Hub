// 等待DOM内容完全加载后再执行脚本
window.addEventListener('DOMContentLoaded', (event) => {
    // 获取登录表单元素
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单的默认提交行为

            // 获取用户名输入框的值
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value.trim(); // trim()去除首尾空格
            
            // 获取密码输入框的值
            const passwordInput = document.getElementById('password');
            const password = passwordInput.value.trim();

            if (username === "") {
                alert('请输入用户名！');
                usernameInput.focus();
                return; // 如果用户名为空，则不继续执行
            }
            
            if (password === "") {
                alert('请输入密码！');
                passwordInput.focus();
                return; // 如果密码为空，则不继续执行
            }

            // 模拟登录成功后的操作
            // 实际应用中，这里应该有与后端通信的登录验证逻辑
            // 这里简化处理，只要用户名和密码不为空就视为登录成功
            
            // 1. 将用户名存储到localStorage，以便首页可以获取
            localStorage.setItem('biliHubUser', username);
            
            // 2. 添加用户登录标志
            localStorage.setItem('isLoggedIn', 'true');

            // 3. 跳转到Bili-Hub首页
            window.location.href = 'index.html';
        });
    }
});