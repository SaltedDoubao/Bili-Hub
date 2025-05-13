function handleSearch(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    
    // 获取搜索输入
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (keyword) {
        // 构建搜索URL（这里使用Bilibili的搜索URL格式）
        const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
        
        // 在新标签页中打开搜索结果
        window.open(searchUrl, '_blank');
        
        // 清空搜索框
        document.getElementById('searchInput').value = '';
    }
    
    return false; // 防止表单提交
}

// 添加回车键搜索支持
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch(event);
    }
});