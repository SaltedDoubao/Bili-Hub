// script.js
// 确保在DOM完全加载后再执行脚本

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('biliHubUser');
    
    // 获取头像元素
    const avatarContainer = document.querySelector('.avatar-info');
    const avatarDropdown = document.getElementById('avatar-dropdown');
    
    if (avatarContainer) {
        if (isLoggedIn && username) {
            // 用户已登录，显示用户头像和下拉触发器
            avatarContainer.innerHTML = `
                <a href="#" class="avatar-trigger">
                    <img class="avatar" src="../res/images/avatar.png" alt="用户头像">
                </a>
                <div id="avatar-dropdown" class="avatar-dropdown">
                    <div class="avatar-dropdown-content">
                        <div class="user-info">
                            <div class="avatar-large">
                                <img src="../res/images/avatar.png" alt="用户头像">
                            </div>
                            <div class="username">${username}</div>
                            <div class="user-level">
                                <span class="level-tag">Lv.6</span>
                                <span class="vip-tag">大会员</span>
                            </div>
                        </div>
                        <div class="menu-group">
                            <a href="https://space.bilibili.com/" target="_blank">
                                <i class="menu-icon">👤</i>个人中心
                            </a>
                            <a href="https://account.bilibili.com/account/home" target="_blank">
                                <i class="menu-icon">⚙️</i>账号设置
                            </a>
                            <a href="https://pay.bilibili.com/" target="_blank">
                                <i class="menu-icon">💰</i>我的钱包
                            </a>
                        </div>
                        <div class="menu-group">
                            <a href="https://big.bilibili.com/" target="_blank">
                                <i class="menu-icon">🏆</i>成为大会员
                            </a>
                            <a href="https://www.bilibili.com/blackboard/help.html" target="_blank">
                                <i class="menu-icon">❓</i>帮助中心
                            </a>
                        </div>
                        <div class="menu-group border-top">
                            <a href="#" id="logout-btn">
                                <i class="menu-icon">🚪</i>退出登录
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加登出功能
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    // 清除登录信息
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('biliHubUser');
                    // 刷新页面
                    window.location.reload();
                });
            }
        } else {
            // 用户未登录，显示默认头像和登录链接
            avatarContainer.innerHTML = `
                <a href="login.html" class="avatar-trigger">
                    <img class="avatar" src="../res/images/placeholder.png" alt="默认头像">
                </a>
                <div id="avatar-dropdown" class="avatar-dropdown">
                    <div class="avatar-dropdown-content">
                        <div class="login-section">
                            <p>登录后你可以:</p>
                            <ul class="login-benefits">
                                <li>✓ 保存你喜欢的视频</li>
                                <li>✓ 收到订阅内容更新提醒</li>
                                <li>✓ 与创作者互动</li>
                            </ul>
                            <a href="login.html" class="login-btn">立即登录</a>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 添加头像点击切换菜单显示的功能
        const avatarTrigger = document.querySelector('.avatar-trigger');
        if (avatarTrigger) {
            avatarTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = document.getElementById('avatar-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });
            
            // 点击页面其他地方关闭菜单
            document.addEventListener('click', function(e) {
                if (!avatarContainer.contains(e.target)) {
                    const dropdown = document.getElementById('avatar-dropdown');
                    if (dropdown && dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                }
            });
        }
    }

    // 原有的视频加载代码
    const gridContainer = document.querySelector('.video-grid-container');

    if (!gridContainer) {
        console.error('错误：无法找到 .video-grid-container 元素。');
        return;
    }

    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 错误! 状态: ${response.status}`);
            }
            return response.json();
        })
        .then(videos => {
            videos.forEach(video => {
                const article = document.createElement('article');
                article.className = 'video-card';

                const videoCardHTML = `
                    <a href="${video.videoUrl || '#'}" class="thumbnail-link" ${video.videoUrl && video.videoUrl !== '#' ? 'target="_blank"' : ''}>
                        <img src="${video.thumbnailUrl || '../res/images/placeholder.png'}" alt="${video.altText || '视频封面'}"> {/* 提供一个默认图片 */}
                        <span class="duration">${video.duration || ''}</span>
                    </a>
                    <div class="video-info">
                        <h3 class="video-title">
                            <a href="${video.videoUrl || '#'}" ${video.videoUrl && video.videoUrl !== '#' ? 'target="_blank"' : ''}>
                                ${video.title || '无标题'}
                            </a>
                        </h3>
                        <div class="video-meta">
                            <span class="views">${video.views || ''}</span>
                            <span class="upload-time">${video.uploadTime || ''}</span>
                        </div>
                    </div>
                `;

                article.innerHTML = videoCardHTML;

                gridContainer.appendChild(article);
            });
        })
        .catch(error => {
            console.error('无法加载或处理视频数据:', error);
            if (gridContainer) {
                 gridContainer.innerHTML = '<p style="color: red; text-align: center;">无法加载视频列表，请稍后再试。</p>';
            }
        });
});