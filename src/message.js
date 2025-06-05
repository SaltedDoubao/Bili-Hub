// 导入聊天历史管理模块
import {
    chatHistory,
    addMessageToHistory,
    getContactHistory,
    getLastMessage,
    clearHistory
} from './chatData.js';

// 导入API服务模块
import { getLMStudioResponse } from './apiService.js';

// DOM元素
const contactSearch = document.getElementById('contactSearch');
const contacts = document.querySelectorAll('.contact');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

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
    
    // 对所有联系人使用LM Studio API获取回复
    // 显示"正在输入..."提示
    showTypingIndicator();
    
    // 获取聊天历史
    const history = getContactHistory(currentContactId);
    
    // 调用LM Studio API获取回复
    handleLMStudioResponse(message, history);
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

// 处理LM Studio API响应
async function handleLMStudioResponse(message, history) {
    try {
        // 获取当前联系人的头像
        let avatarSrc = '../res/images/placeholder.png';
        if (currentContactId === "1") {
            avatarSrc = '../res/images/gemini.png';
        }
        
        // 调用LM Studio API获取回复，传入当前联系人ID
        const response = await getLMStudioResponse(message, history, currentContactId);
        
        // 检查是否有错误
        if (response && response.error) {
            // 移除"正在输入..."提示
            removeTypingIndicator();
            
            // 显示错误消息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message received error';
            errorDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="${avatarSrc}" alt="AI">
                </div>
                <div class="message-content">
                    <div class="message-bubble error-bubble">
                        <div class="message-text">${response.message}</div>
                    </div>
                    <div class="message-time">系统错误</div>
                </div>
            `;
            chatMessages.appendChild(errorDiv);
            
            // 滚动到底部
            scrollToBottom();
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // 创建回复消息对象
        const replyObj = {
            type: 'received',
            text: response,
            time: time,
            avatar: avatarSrc,
            role: 'assistant'
        };
        
        // 添加到聊天历史
        addMessageToHistory(currentContactId, replyObj);
        
        // 移除"正在输入..."提示
        removeTypingIndicator();
        
        // 创建回复消息元素
        const replyElement = document.createElement('div');
        replyElement.className = 'message received';
        replyElement.innerHTML = `
            <div class="message-avatar">
                <img src="${avatarSrc}" alt="AI">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">${escapeHtml(response)}</div>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(replyElement);
        
        // 更新联系人的最后一条消息
        updateContactLastMessage(document.querySelector(`.contact[data-userid="${currentContactId}"]`), response, true);
        
        // 滚动到底部
        scrollToBottom();
    } catch (error) {
        console.error("处理LLM响应错误:", error);
        
        // 移除"正在输入..."提示
        removeTypingIndicator();
        
        // 显示错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message received error';
        let avatarSrc = '../res/images/placeholder.png';
        if (currentContactId === "1") {
            avatarSrc = '../res/images/gemini.png';
        }
        
        errorDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${avatarSrc}" alt="AI">
            </div>
            <div class="message-content">
                <div class="message-bubble error-bubble">
                    <div class="message-text">抱歉，发生了错误: ${error.message}</div>
                </div>
                <div class="message-time">系统错误</div>
            </div>
        `;
        chatMessages.appendChild(errorDiv);
        
        // 滚动到底部
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
function updateContactLastMessage(contact, message, isAssistant = false) {
    const lastMessageEl = contact.querySelector('.contact-last-message');
    if (lastMessageEl) {
        lastMessageEl.textContent = isAssistant ? 'AI' : message;
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