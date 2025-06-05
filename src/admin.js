// 导入用户服务模块
import { exportUsersToCsv, importUsersFromCsv } from './userService.js';

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const csvFileInput = document.getElementById('csvFile');
    const userTableBody = document.getElementById('userTableBody');
    const paginationContainer = document.getElementById('pagination');
    const messageArea = document.querySelector('.message-area');

    // 分页设置
    const itemsPerPage = 10;
    let currentPage = 1;
    let users = [];

    // 初始化页面
    init();

    // 按钮事件监听
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', handleImport);
    refreshBtn.addEventListener('click', loadUsers);

    // 初始化函数
    function init() {
        // 验证用户是否登录
        if (!localStorage.getItem('isLoggedIn')) {
            showMessage('请先登录系统', 'error');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
            return;
        }

        // 检查是否为管理员
        const username = localStorage.getItem('biliHubUser');
        if (username !== 'admin') {
            showMessage('只有管理员可以访问此页面', 'error');
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2000);
            return;
        }

        // 加载用户列表
        loadUsers();
    }

    // 加载用户列表
    function loadUsers() {
        try {
            // 获取用户数据
            users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
            
            // 更新表格
            updateTable();
            
            showMessage(`已加载 ${users.length} 个用户数据`, 'success');
        } catch (error) {
            console.error('加载用户数据失败:', error);
            showMessage('加载用户数据失败: ' + error.message, 'error');
        }
    }

    // 更新用户表格
    function updateTable() {
        // 清空表格
        userTableBody.innerHTML = '';
        
        // 计算分页
        const totalPages = Math.ceil(users.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, users.length);
        
        // 如果当前页超出范围，重置为第一页
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = 1;
            updateTable();
            return;
        }
        
        // 添加用户数据行
        for (let i = start; i < end; i++) {
            const user = users[i];
            
            // 格式化日期
            const registerDate = new Date(user.registerDate).toLocaleDateString();
            const lastLogin = new Date(user.lastLogin).toLocaleDateString();
            
            // 创建表格行
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.nickname}</td>
                <td>${user.email || '-'}</td>
                <td>${registerDate}</td>
                <td>${lastLogin}</td>
            `;
            
            userTableBody.appendChild(row);
        }
        
        // 更新分页控件
        updatePagination(totalPages);
    }

    // 更新分页控件
    function updatePagination(totalPages) {
        // 清空分页容器
        paginationContainer.innerHTML = '';
        
        // 如果没有数据或只有一页，不显示分页
        if (totalPages <= 1) return;
        
        // 添加上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '上一页';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateTable();
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // 添加页码按钮
        // 最多显示5个页码按钮
        const maxPageBtns = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageBtns / 2));
        let endPage = Math.min(totalPages, startPage + maxPageBtns - 1);
        
        // 调整起始页码
        if (endPage - startPage + 1 < maxPageBtns) {
            startPage = Math.max(1, endPage - maxPageBtns + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i.toString();
            pageBtn.classList.toggle('active', i === currentPage);
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // 添加下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '下一页';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateTable();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // 导出用户数据
    function handleExport() {
        try {
            const result = exportUsersToCsv();
            if (result) {
                showMessage('用户数据导出成功！', 'success');
            } else {
                showMessage('导出失败，请重试', 'error');
            }
        } catch (error) {
            console.error('导出用户数据错误:', error);
            showMessage('导出错误: ' + error.message, 'error');
        }
    }

    // 导入用户数据
    function handleImport() {
        // 检查是否选择了文件
        if (!csvFileInput.files || csvFileInput.files.length === 0) {
            showMessage('请先选择CSV文件', 'error');
            return;
        }
        
        const file = csvFileInput.files[0];
        
        // 检查文件类型
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            showMessage('请选择CSV格式的文件', 'error');
            return;
        }
        
        // 读取文件内容
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const csvContent = e.target.result;
                const result = importUsersFromCsv(csvContent);
                
                if (result) {
                    showMessage('用户数据导入成功！', 'success');
                    loadUsers(); // 刷新用户列表
                } else {
                    showMessage('导入失败，请检查CSV格式', 'error');
                }
            } catch (error) {
                console.error('导入用户数据错误:', error);
                showMessage('导入错误: ' + error.message, 'error');
            }
        };
        
        reader.onerror = function() {
            showMessage('读取文件失败，请重试', 'error');
        };
        
        // 开始读取文件
        reader.readAsText(file);
    }

    // 显示消息
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