// script.js

// 确保在DOM完全加载后再执行脚本
document.addEventListener('DOMContentLoaded', function() {

    // 获取视频网格容器元素
    const gridContainer = document.querySelector('.video-grid-container');

    // 检查容器是否存在
    if (!gridContainer) {
        console.error('错误：无法找到 .video-grid-container 元素。');
        return; // 如果找不到容器，则停止执行
    }

    // 使用 fetch API 加载 JSON 文件
    fetch('videos.json')
        .then(response => {
            // 检查请求是否成功
            if (!response.ok) {
                // 如果服务器响应状态不是 2xx，则抛出错误
                throw new Error(`HTTP 错误! 状态: ${response.status}`);
            }
            // 解析 JSON 数据
            return response.json();
        })
        .then(videos => {
            // 清空容器中可能存在的任何占位符内容（可选）
            // gridContainer.innerHTML = '';

            // 遍历从 JSON 文件获取的视频数据数组
            videos.forEach(video => {
                // 为每个视频创建一个 video-card article 元素
                const article = document.createElement('article');
                article.className = 'video-card';

                // 使用模板字面量 (Template Literals) 创建卡片的内部 HTML 结构
                // 这样比一个个 createElement 更简洁
                const videoCardHTML = `
                    <a href="${video.videoUrl || '#'}" class="thumbnail-link" ${video.videoUrl && video.videoUrl !== '#' ? 'target="_blank"' : ''}>
                        <img src="${video.thumbnailUrl || '../static/images/placeholder.png'}" alt="${video.altText || '视频封面'}"> {/* 提供一个默认图片 */}
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

                // 将生成的 HTML 字符串设置给 article 元素
                article.innerHTML = videoCardHTML;

                // 将创建好的视频卡片添加到网格容器中
                gridContainer.appendChild(article);
            });
        })
        .catch(error => {
            // 处理加载或解析 JSON 过程中的任何错误
            console.error('无法加载或处理视频数据:', error);
            // 可以在页面上显示一个错误信息给用户
            if (gridContainer) {
                 gridContainer.innerHTML = '<p style="color: red; text-align: center;">无法加载视频列表，请稍后再试。</p>';
            }
        });
});