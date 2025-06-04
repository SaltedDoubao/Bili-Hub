// 导入聊天历史管理模块
import {
    chatHistory,
    addMessageToHistory,
    getContactHistory,
    getLastMessage,
    clearHistory
} from './chatData.js';

// DOM元素
const contactSearch = document.getElementById('contactSearch');
const contacts = document.querySelectorAll('.contact');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

// LM Studio API配置
const LM_STUDIO_API = 'http://127.0.0.1:1234/v1/chat/completions';
// CORS代理设置 (可选两种方案)
// 方案1: 使用公共CORS代理 (不推荐用于生产环境)
const USE_CORS_PROXY = false; // 设为true启用
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
// 方案2: 使用本地代理 (需要先运行: npx local-cors-proxy --proxyUrl http://127.0.0.1:1234 --port 8010)
const USE_LOCAL_PROXY = true; // 设为true启用
const LOCAL_PROXY_URL = 'http://localhost:8010/proxy';

// 当前活动的联系人ID
let currentContactId = "1";

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 加载默认联系人的聊天记录
    loadChatHistory(currentContactId);
    
    // 监听消息输入框高度自动调整
    setupTextareaAutoResize();
    
    // 监听发送按钮点击事件
    setupSendButton();
    
    // 初始化联系人点击事件
    setupContactsClick();
    
    // 初始化联系人搜索功能
    setupContactSearch();
});

// 加载指定联系人的聊天记录
function loadChatHistory(contactId) {
    // 清空当前聊天区域
    chatMessages.innerHTML = '';
    
    // 获取联系人的聊天记录
    const history = getContactHistory(contactId);
    
    // 检查是否有此联系人的聊天记录
    if (history && history.length > 0) {
        // 逐条添加聊天记录
        history.forEach(message => {
            if (message.type === 'date') {
                // 添加日期分隔符
                const dateDiv = document.createElement('div');
                dateDiv.className = 'date-separator';
                dateDiv.innerHTML = `<span>${message.content}</span>`;
                chatMessages.appendChild(dateDiv);
            } else if (message.type === 'received') {
                // 添加接收的消息
                const msgDiv = document.createElement('div');
                msgDiv.className = 'message received';
                msgDiv.innerHTML = `
                    <div class="message-avatar">
                        <img src="${message.avatar}" alt="用户头像">
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <div class="message-text">${message.text}</div>
                        </div>
                        <div class="message-time">${message.time}</div>
                    </div>
                `;
                chatMessages.appendChild(msgDiv);
            } else if (message.type === 'sent') {
                // 添加发送的消息
                const msgDiv = document.createElement('div');
                msgDiv.className = 'message sent';
                msgDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-bubble">
                            <div class="message-text">${message.text}</div>
                        </div>
                        <div class="message-time">${message.time}</div>
                    </div>
                `;
                chatMessages.appendChild(msgDiv);
            }
        });
        
        // 滚动到底部
        scrollToBottom();
    }
}

// 自动调整文本域高度
function setupTextareaAutoResize() {
    messageInput.addEventListener('input', function() {
        // 重置高度
        this.style.height = 'auto';
        
        // 设置新高度 (最大高度由CSS中的max-height控制)
        const newHeight = Math.min(this.scrollHeight, 120);
        this.style.height = newHeight + 'px';
    });
}

// 设置发送按钮功能
function setupSendButton() {
    // 监听发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);
    
    // 监听Enter键发送消息 (Shift+Enter换行)
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}

// 发送消息方法
function sendMessage() {
    const message = messageInput.value.trim();
    
    // 如果消息为空，不发送
    if (!message) return;
    
    // 获取当前时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // 创建新消息对象
    const newMessageObj = {
        type: 'sent',
        text: message,
        time: time,
        role: 'user'
    };
    
    // 添加到聊天历史记录
    addMessageToHistory(currentContactId, newMessageObj);
    
    // 创建新消息元素并添加到UI
    const newMessage = document.createElement('div');
    newMessage.className = 'message sent';
    
    // 设置消息内容
    newMessage.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">
                <div class="message-text">${escapeHtml(message)}</div>
            </div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // 添加消息到聊天区域
    chatMessages.appendChild(newMessage);
    
    // 清空输入框并重置高度
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // 滚动到底部
    scrollToBottom();
    
    // 更新联系人的最后一条消息
    updateContactLastMessage(document.querySelector(`.contact[data-userid="${currentContactId}"]`), message);
    
    // 如果是与Gemma3聊天，则通过LM Studio API获取回复
    if (currentContactId === "1") {
        // 显示"正在输入..."提示
        showTypingIndicator();
        
        // 调用LM Studio API获取回复
        getLMStudioResponse(message);
    } else {
        // 其他联系人仍使用模拟回复
        setTimeout(() => {
            simulateReply();
        }, 1000);
    }
}

// 显示"正在输入..."提示
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message received typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="../res/images/gemini.png" alt="Gemma3">
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="message-text">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// 移除"正在输入..."提示
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// 使用LM Studio API获取回复
async function getLMStudioResponse(message) {
    try {
        // 准备发送给LLM的消息历史
        const messages = [];
        
        // 添加系统提示，设定角色为"Gemma3"
        messages.push({
            role: "system",
            content: "你是一个名叫'Gemma3'的AI助手，正在B站风格的聊天应用中与用户交流。请保持友好、活泼的语气，回答简洁但有帮助性。你的回复将显示在一个聊天界面中，所以不需要过于冗长。"
        });
        
        // 添加之前的对话历史
        const history = getContactHistory("1");
        history.forEach(msg => {
            if (msg.role && (msg.role === 'user' || msg.role === 'assistant')) {
                messages.push({
                    role: msg.role,
                    content: msg.text
                });
            }
        });
        
        // 发送请求到LM Studio API
        const requestBody = {
            messages: [{role: "user", content: message}],
            model: "gemma-3-4b-it-qat",
            max_tokens: 16384,
            temperature: 0.9,
            stream: false
        };
        
        console.log("发送API请求:", JSON.stringify(requestBody));
        
        // 根据配置决定是否使用CORS代理
        let apiUrl = LM_STUDIO_API;
        if (USE_CORS_PROXY) {
            apiUrl = CORS_PROXY + LM_STUDIO_API;
        } else if (USE_LOCAL_PROXY) {
            apiUrl = LOCAL_PROXY_URL + '/v1/chat/completions';
        }
        console.log("使用API地址:", apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'  // 对某些CORS代理是必需的
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // 移除输入提示
        removeTypingIndicator();
        
        // 获取当前时间
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // 创建回复消息对象
        const replyObj = {
            type: 'received',
            text: aiResponse,
            time: time,
            avatar: '../res/images/gemini.png',
            role: 'assistant'
        };
        
        // 添加到聊天历史
        addMessageToHistory("1", replyObj);
        
        // 显示回复
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message received';
        replyDiv.innerHTML = `
            <div class="message-avatar">
                <img src="../res/images/gemini.png" alt="Gemma3">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">${aiResponse}</div>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatMessages.appendChild(replyDiv);
        scrollToBottom();
        
        // 更新联系人最后一条消息
        updateContactLastMessage(document.querySelector('.contact[data-userid="1"]'), aiResponse);
        
    } catch (error) {
        console.error("LLM API错误:", error);
        
        // 移除输入提示
        removeTypingIndicator();
        
        // 构建错误信息
        let errorMessage = `抱歉，AI服务暂时无法连接。请确保LM Studio已在本地运行并监听端口1234。`;
        errorMessage += `<br><small>错误详情: ${error.message}</small>`;
        
        // 添加CORS解决建议
        if (error.message.includes("CORS") || error.message.includes("cross-origin")) {
            errorMessage += `<br><small>这可能是CORS跨域问题，请尝试：
            <ol>
                <li>启动本地代理: <code>npx local-cors-proxy --proxyUrl http://127.0.0.1:1234 --port 8010</code></li>
                <li>然后设置USE_LOCAL_PROXY = true</li>
                <li>或修改LM Studio配置允许跨域请求</li>
            </ol></small>`;
        } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            errorMessage += `<br><small>连接错误，请确保LM Studio正在运行，且API服务器已启动</small>`;
        }
        
        // 显示错误信息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message received error';
        errorDiv.innerHTML = `
            <div class="message-avatar">
                <img src="../res/images/gemini.png" alt="Gemma3">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">
                        ${errorMessage}
                    </div>
                </div>
                <div class="message-time">${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}</div>
            </div>
        `;
        
        chatMessages.appendChild(errorDiv);
        scrollToBottom();
    }
}

// 模拟接收消息 (用于与非Gemma3的联系人交流)
function simulateReply() {
    // 获取当前选中的联系人
    const activeContact = document.querySelector('.contact.active');
    if (!activeContact) return;
    
    // 获取联系人姓名和头像
    const contactName = activeContact.querySelector('.contact-name').textContent;
    const contactAvatar = activeContact.querySelector('.contact-avatar img').src;
    
    // 创建回复消息数组
    const replies = [
        "好的，我知道了！",
        "谢谢你的消息，我会尽快回复。",
        "这个主意听起来不错！",
        "我需要再考虑一下这个问题。",
        "你是怎么想到这个的？真有创意！",
        "我们可以明天再讨论这个话题吗？",
        "我很期待你的下一个视频！",
        "确实如此，我完全同意你的观点。"
    ];
    
    // 随机选择一条回复
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    // 获取当前时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // 创建回复消息对象
    const replyObj = {
        type: 'received',
        text: randomReply,
        time: time,
        avatar: contactAvatar
    };
    
    // 添加到聊天历史记录
    addMessageToHistory(currentContactId, replyObj);
    
    // 创建新的回复消息元素
    const newReply = document.createElement('div');
    newReply.className = 'message received';
    
    // 设置回复内容
    newReply.innerHTML = `
        <div class="message-avatar">
            <img src="${contactAvatar}" alt="${contactName}">
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="message-text">${randomReply}</div>
            </div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // 添加回复到聊天区域
    chatMessages.appendChild(newReply);
    
    // 滚动到底部
    scrollToBottom();
    
    // 更新联系人最后一条消息
    updateContactLastMessage(activeContact, randomReply);
}

// 更新联系人最后一条消息
function updateContactLastMessage(contact, message) {
    const lastMessageEl = contact.querySelector('.contact-last-message');
    if (lastMessageEl) {
        lastMessageEl.textContent = message;
    }
}

// 滚动聊天区域到底部
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 设置联系人点击事件
function setupContactsClick() {
    contacts.forEach(contact => {
        contact.addEventListener('click', function() {
            // 移除所有联系人的active类
            contacts.forEach(c => c.classList.remove('active'));
            
            // 给当前点击的联系人添加active类
            this.classList.add('active');
            
            // 获取联系人ID和信息
            const contactId = this.getAttribute('data-userid');
            const contactName = this.querySelector('.contact-name').textContent;
            const contactAvatar = this.querySelector('.contact-avatar img').src;
            const statusBadge = this.querySelector('.status-badge');
            let statusText = '离线';
            
            // 更新当前联系人ID
            currentContactId = contactId;
            
            // 根据状态标识设置状态文本
            if (statusBadge.classList.contains('online')) {
                statusText = '在线';
            } else if (statusBadge.classList.contains('away')) {
                statusText = '离开';
            }
            
            // 更新聊天头部信息
            document.querySelector('.chat-user-name').textContent = contactName;
            document.querySelector('.chat-user-avatar').src = contactAvatar;
            document.querySelector('.chat-user-status').textContent = statusText;
            
            // 加载此联系人的聊天记录
            loadChatHistory(contactId);
            
            // 移除未读消息标识
            const unreadBadge = this.querySelector('.unread-badge');
            if (unreadBadge) {
                unreadBadge.remove();
            }
        });
    });
}

// 设置联系人搜索功能
function setupContactSearch() {
    contactSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // 如果搜索框为空，显示所有联系人
        if (!searchTerm) {
            contacts.forEach(contact => {
                contact.style.display = 'flex';
            });
            return;
        }
        
        // 过滤联系人
        contacts.forEach(contact => {
            const name = contact.querySelector('.contact-name').textContent.toLowerCase();
            const lastMessage = contact.querySelector('.contact-last-message').textContent.toLowerCase();
            
            // 如果名称或最后一条消息包含搜索词，显示联系人
            if (name.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                contact.style.display = 'flex';
            } else {
                contact.style.display = 'none';
            }
        });
    });
}

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML
        .replace(/\n/g, '<br>') // 保留换行
        .replace(/  /g, '&nbsp;&nbsp;'); // 保留连续空格
} 