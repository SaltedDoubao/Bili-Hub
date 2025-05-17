function handleSearch(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    
    // 获取搜索输入
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (keyword) {
        // 保存到搜索历史
        saveSearchHistory(keyword);
        
        // 构建搜索URL（这里使用Bilibili的搜索URL格式）
        const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
        
        // 在新标签页中打开搜索结果
        window.open(searchUrl, '_blank');
        
        // 清空搜索框
        document.getElementById('searchInput').value = '';
    }
    
    return false; // 防止表单提交
}

// 保存搜索历史到localStorage
function saveSearchHistory(keyword) {
    // 获取现有的搜索历史
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 如果关键词已存在，先移除旧的
    history = history.filter(item => item !== keyword);
    
    // 添加新的关键词到历史开头
    history.unshift(keyword);
    
    // 限制历史记录数量为10个
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // 保存回localStorage
    localStorage.setItem('searchHistory', JSON.stringify(history));
    
    // 更新显示的搜索历史
    updateSearchDropdown();
}

// 更新搜索历史下拉框
function updateSearchDropdown() {
    const searchDropdown = document.querySelector('.search-dropdown');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 确保下拉框初始状态隐藏
    searchDropdown.style.display = 'none';
    searchDropdown.style.opacity = '0';
    searchDropdown.style.visibility = 'hidden';
    
    // 清空现有内容
    searchDropdown.innerHTML = '';
    
    if (history.length > 0) {
        // 创建搜索历史内容容器
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'search-dropdown-content';
        
        // 添加历史记录
        history.forEach(item => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = item;
            
            // 点击历史记录执行搜索
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('searchInput').value = item;
                handleSearch(new Event('submit'));
            });
            
            dropdownContent.appendChild(link);
        });
        
        // 添加清除历史按钮
        const clearButton = document.createElement('a');
        clearButton.href = '#';
        clearButton.textContent = '清除搜索历史';
        clearButton.style.textAlign = 'center';
        clearButton.style.color = '#ff9900';
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('searchHistory');
            updateSearchDropdown();
        });
        
        dropdownContent.appendChild(clearButton);
        searchDropdown.appendChild(dropdownContent);
    }
}

// 添加回车键搜索支持
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch(event);
    }
});

// 添加焦点事件显示搜索历史
document.getElementById('searchInput').addEventListener('focus', function() {
    updateSearchDropdown();
    const searchDropdown = document.querySelector('.search-dropdown');
    
    // 使用setTimeout确保DOM更新和CSS应用后再显示
    setTimeout(() => {
        searchDropdown.style.display = 'block';
        // 强制重绘使得定位生效
        searchDropdown.getBoundingClientRect();
        searchDropdown.style.opacity = '1';
        searchDropdown.style.visibility = 'visible';
    }, 10);
});

// 初始化时更新一次搜索历史
document.addEventListener('DOMContentLoaded', function() {
    updateSearchDropdown();
});

// 添加点击文档其他区域关闭搜索历史
document.addEventListener('click', function(event) {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.querySelector('.search-dropdown');
    
    // 如果点击的不是搜索框和搜索历史区域
    if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
        // 先将透明度和可见性设置为隐藏，然后延迟关闭display
        searchDropdown.style.opacity = '0';
        searchDropdown.style.visibility = 'hidden';
        
        setTimeout(() => {
            searchDropdown.style.display = 'none';
        }, 200); // 与CSS过渡时间匹配
    }
});