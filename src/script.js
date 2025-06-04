document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏控制
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // 点击汉堡菜单切换侧边栏显示/隐藏
    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });

        // 点击遮罩层关闭侧边栏
        overlay.addEventListener('click', function() {
            closeSidebar();
        });

        // 按ESC键关闭侧边栏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    }

    // 切换侧边栏显示/隐藏
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        hamburger.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    // 关闭侧边栏
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 添加滚动监听，控制顶栏样式
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            // 滚动超过50px时，改变顶栏样式
            header.style.padding = '5px 10px'; // 缩小padding
            header.style.background = 'rgba(27, 27, 27, 0.95)'; // 半透明背景
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)'; // 添加阴影
        } else {
            // 恢复原始样式
            header.style.padding = '10px 10px';
            header.style.background = '#1b1b1b';
            header.style.boxShadow = 'none';
        }
    });

    // 加载并初始化轮播图
    const loadCarouselData = function() {
        const carousel = document.querySelector('.carousel');
        const carouselNav = document.querySelector('.carousel-nav');
        if (!carousel || !carouselNav) return;
        
        // 获取箭头按钮引用（这些元素在HTML中已存在）
        const prevBtn = carousel.querySelector('.carousel-arrow-prev');
        const nextBtn = carousel.querySelector('.carousel-arrow-next');

        // 从JSON文件加载轮播图数据
        fetch('carousel.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP 错误! 状态: ${response.status}`);
                }
                return response.json();
            })
            .then(carouselData => {
                // 创建轮播图幻灯片和导航点
                carouselData.forEach((item, index) => {
                    // 创建幻灯片
                    const slide = document.createElement('div');
                    slide.className = 'carousel-slide';
                    if (index === 0) slide.classList.add('active'); // 第一张幻灯片激活
                    
                    // 如果有链接，则创建一个包装链接
                    let slideContent;
                    if (item.link && item.link !== '#') {
                        slideContent = document.createElement('a');
                        slideContent.href = item.link;
                        slideContent.target = '_blank';
                        slideContent.style.display = 'block';
                        slideContent.style.width = '100%';
                        slideContent.style.height = '100%';
                    } else {
                        slideContent = document.createElement('div');
                        slideContent.style.width = '100%';
                        slideContent.style.height = '100%';
                    }
                    
                    // 添加图片
                    const img = document.createElement('img');
                    img.src = item.imageUrl || '../res/images/placeholder.png';
                    img.alt = item.title || `轮播图${index + 1}`;
                    
                    // 添加信息层
                    const info = document.createElement('div');
                    info.className = 'carousel-info';
                    
                    const title = document.createElement('h3');
                    title.className = 'carousel-title';
                    title.textContent = item.title || '';
                    
                    const description = document.createElement('p');
                    description.className = 'carousel-description';
                    description.textContent = item.description || '';
                    
                    info.appendChild(title);
                    info.appendChild(description);
                    
                    slideContent.appendChild(img);
                    slide.appendChild(slideContent);
                    slide.appendChild(info);
                    
                    // 将幻灯片添加到轮播图容器前面，在箭头按钮之前
                    carousel.insertBefore(slide, prevBtn);
                    
                    // 创建导航点
                    const dot = document.createElement('div');
                    dot.className = 'carousel-dot';
                    if (index === 0) dot.classList.add('active'); // 第一个导航点激活
                    dot.setAttribute('data-index', index);
                    carouselNav.appendChild(dot);
                });
                
                // 初始化轮播图功能
                initCarousel();
            })
            .catch(error => {
                console.error('无法加载或处理轮播图数据:', error);
                carousel.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">无法加载轮播图，请稍后再试。</p>';
            });
    };

    // 轮播图功能
    const initCarousel = function() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('.carousel-arrow-prev');
        const nextBtn = carousel.querySelector('.carousel-arrow-next');
        
        // 如果没有幻灯片，直接返回
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        let autoplayInterval;

        // 显示指定索引的幻灯片
        function showSlide(index) {
            // 确保索引在有效范围内
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // 更新当前索引
            currentIndex = index;
            
            // 更新幻灯片显示状态
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            // 更新指示点状态
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // 切换到下一张幻灯片
        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        // 切换到上一张幻灯片
        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        // 开始自动播放
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000); // 5秒切换一次
        }

        // 停止自动播放
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }

        // 绑定事件
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoplay();
                startAutoplay(); // 点击后重新开始计时
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoplay();
                startAutoplay(); // 点击后重新开始计时
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                stopAutoplay();
                startAutoplay(); // 点击后重新开始计时
            });
        });

        // 鼠标悬停暂停自动播放，鼠标离开继续自动播放
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // 开始自动播放
        startAutoplay();
    };

    // 加载轮播图数据
    loadCarouselData();

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
                            <a href="./userpage.html">
                                <i class="menu-icon">👤</i>个人中心
                            </a>
                            <a href="" target="_blank">
                                <i class="menu-icon">⚙️</i>账号设置
                            </a>
                            <a href="" target="_blank">
                                <i class="menu-icon">💰</i>我的钱包
                            </a>
                        </div>
                        <div class="menu-group">
                            <a href="" target="_blank">
                                <i class="menu-icon">🏆</i>成为大会员
                            </a>
                            <a href="" target="_blank">
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