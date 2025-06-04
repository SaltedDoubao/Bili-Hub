document.addEventListener('DOMContentLoaded', function() {
    // 获取用户名称，如果有登录信息则显示
    const username = localStorage.getItem('biliHubUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (username && isLoggedIn) {
        // 如果已登录，更新页面中的用户名
        const usernameElements = document.querySelectorAll('.username-large');
        usernameElements.forEach(element => {
            element.textContent = username;
        });
    }
    
    // 关注按钮交互效果
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            // 切换关注状态
            if (this.classList.contains('following')) {
                // 取消关注
                this.classList.remove('following');
                this.innerHTML = '<span class="follow-icon">+</span><span>关注</span>';
                this.style.backgroundColor = '#ff9900';
                
                // 显示成功消息
                showToast('已取消关注');
            } else {
                // 添加关注
                this.classList.add('following');
                this.innerHTML = '<span>已关注</span>';
                this.style.backgroundColor = '#666666';
                
                // 显示成功消息
                showToast('关注成功');
            }
        });
    }
    
    // 私信按钮交互
    const messageBtn = document.querySelector('.message-btn');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            if (!isLoggedIn) {
                // 如果未登录，提示登录
                showToast('请先登录后再发送私信');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                // 已登录，跳转到私信页面
                window.location.href = 'message.html';
            }
        });
    }
    
    // 内容导航栏项目点击效果
    const navItems = document.querySelectorAll('.user-nav-item');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // 如果不是当前激活的导航项
                if (!this.classList.contains('active')) {
                    e.preventDefault();
                    
                    // 移除所有导航项的激活状态
                    navItems.forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                    
                    // 添加当前点击项的激活状态
                    this.classList.add('active');
                    
                    // 这里可以添加加载对应内容的逻辑
                    // 例如：loadContent(this.getAttribute('data-tab'));
                    
                    // 显示开发中提示
                    showToast('该功能正在开发中...');
                }
            });
        });
    }
    
    // 视频卡片悬停效果增强
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // 合集卡片点击效果
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.addEventListener('click', function() {
            showToast('合集功能正在开发中...');
        });
    });
    
    // "查看更多"按钮点击效果
    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('正在加载更多内容...');
            
            // 这里可以添加实际的加载更多逻辑
            // loadMoreVideos();
        });
    }
    
    // 显示提示消息的函数
    function showToast(message) {
        // 检查是否已存在toast元素，如果有则移除
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新的toast元素
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        // 添加到页面中
        document.body.appendChild(toast);
        
        // 添加样式
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        // 显示toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 设置定时器，3秒后隐藏toast
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}); 