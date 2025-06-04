// 用于存储每个联系人的聊天记录
const chatHistory = {
    // Gemma3的聊天记录(ID: 1) - 将连接到LM Studio
    "1": [
        {
            type: 'date',
            content: '今天'
        },
        {
            type: 'received', 
            text: '你好，我是Gemma3，一个AI助手。有什么我可以帮助你的吗？', 
            time: '12:25',
            avatar: '../res/images/gemini.png',
            role: 'assistant'
        }
    ],
    // B站用户的聊天记录(ID: 2)
    "2": [
        {
            type: 'date',
            content: '昨天'
        },
        {
            type: 'received', 
            text: '你好，我是B站的忠实用户', 
            time: '19:40',
            avatar: '../res/images/placeholder.png'
        },
        {
            type: 'sent', 
            text: '你好啊，感谢你的关注！', 
            time: '20:05'
        }
    ],
    // 哔哩哔哩官方的聊天记录(ID: 3)
    "3": [
        {
            type: 'date',
            content: '周一'
        },
        {
            type: 'received', 
            text: '您的投稿已通过审核', 
            time: '09:30',
            avatar: '../res/images/placeholder.png'
        },
        {
            type: 'received', 
            text: '感谢您对平台的贡献，期待您的更多优质创作', 
            time: '09:31',
            avatar: '../res/images/placeholder.png'
        },
        {
            type: 'sent', 
            text: '谢谢官方的认可，我会继续努力创作的！', 
            time: '10:15'
        }
    ]
};

// 将聊天记录添加到聊天历史中的函数
function addMessageToHistory(contactId, message) {
    // 如果不存在此联系人的聊天记录，初始化一个
    if (!chatHistory[contactId]) {
        chatHistory[contactId] = [
            {
                type: 'date',
                content: '今天'
            }
        ];
    }
    
    // 将消息添加到聊天历史中
    chatHistory[contactId].push(message);
}

// 获取聊天记录的函数
function getContactHistory(contactId) {
    return chatHistory[contactId] || [];
}

// 修改聊天记录的函数（用于编辑或删除消息）
function updateMessage(contactId, messageIndex, updatedMessage) {
    if (chatHistory[contactId] && chatHistory[contactId][messageIndex]) {
        chatHistory[contactId][messageIndex] = {
            ...chatHistory[contactId][messageIndex],
            ...updatedMessage
        };
        return true;
    }
    return false;
}

// 获取联系人最后一条消息
function getLastMessage(contactId) {
    if (!chatHistory[contactId] || chatHistory[contactId].length === 0) {
        return null;
    }
    
    // 从后往前找第一条非日期类型的消息
    for (let i = chatHistory[contactId].length - 1; i >= 0; i--) {
        const message = chatHistory[contactId][i];
        if (message.type !== 'date') {
            return message;
        }
    }
    return null;
}

// 清除指定联系人的聊天记录
function clearHistory(contactId) {
    if (chatHistory[contactId]) {
        // 只保留日期标题
        const dateHeader = chatHistory[contactId].find(msg => msg.type === 'date');
        chatHistory[contactId] = dateHeader ? [dateHeader] : [];
        return true;
    }
    return false;
}

// 导出聊天历史相关函数
export {
    chatHistory,
    addMessageToHistory,
    getContactHistory,
    updateMessage,
    getLastMessage,
    clearHistory
}; 