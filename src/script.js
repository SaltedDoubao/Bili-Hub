// script.js
// 确保在DOM完全加载后再执行脚本

document.addEventListener('DOMContentLoaded', function() {

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