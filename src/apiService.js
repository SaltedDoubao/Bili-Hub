// LM Studio API配置
const LM_STUDIO_API = 'http://127.0.0.1:12393/v1/chat/completions';
// CORS代理设置 (可选两种方案)
// 方案1: 使用公共CORS代理 (不推荐用于生产环境)
const USE_CORS_PROXY = false; // 设为true启用
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
// 方案2: 使用本地代理 (需要先运行: npx local-cors-proxy --proxyUrl http://127.0.0.1:12393 --port 8010)
const USE_LOCAL_PROXY = true; // 设为true启用
const LOCAL_PROXY_URL = 'http://localhost:8010/proxy';

// 为不同角色定义不同的提示词
const ROLE_PROMPTS = {
    // Gemma3（AI助手）角色提示词
    "1": "你是一个名叫'Gemma3'的AI助手，正在B站风格的聊天应用中与用户交流。请保持友好、活泼的语气，回答简洁但有帮助性。适当加入一些二次元相关的表达和梗，但不要过度。你对动漫、游戏和各种互联网文化非常了解。偶尔可以使用颜文字表达情感。",
    
    // B站用户角色提示词
    "2": "你是一个B站的忠实用户和UP主，拥有丰富的二次元文化和互联网流行趋势知识。在对话中要表现得像一个真实的B站用户，热衷分享自己喜欢的番剧、游戏和视频创作经验。使用年轻人的网络用语和B站特有的术语（如'入坑'、'补番'、'高能'等）。你喜欢使用表情符号和颜文字，对热门话题总是很兴奋。",
    
    // 哔哩哔哩官方角色提示词
    "3": "你是哔哩哔哩官方客服代表，态度专业、亲切但不过于随意。回应用户时应保持礼貌且有帮助性，熟悉B站的所有功能、政策和社区规范。当用户询问平台功能、内容审核、账号问题等，提供准确的官方指导。使用的语气应该体现B站品牌形象——既专业又略带亲和力。在回复中可以适当加入'小破站'等B站特色自称，但整体应维持官方的专业性。"
};

// 默认模型设置
const DEFAULT_MODEL = "gemma-3-4b-it-qat"; // 默认使用的模型

// 使用LM Studio API获取回复
export async function getLMStudioResponse(message, history, contactId = "1") {
    try {
        // 准备发送给LLM的消息历史
        const messages = [];
        
        // 添加系统提示，根据联系人ID选择不同的角色提示词
        messages.push({
            role: "system",
            content: ROLE_PROMPTS[contactId] || ROLE_PROMPTS["1"] // 如果没有对应的提示词，默认使用Gemma3的提示词
        });
        
        // 添加之前的对话历史
        history.forEach(msg => {
            if (msg.type === 'sent') {
                messages.push({
                    role: "user",
                    content: msg.text
                });
            } else if (msg.type === 'received') {
                messages.push({
                    role: "assistant",
                    content: msg.text
                });
            }
        });
        
        // 添加当前消息
        messages.push({
            role: "user",
            content: message
        });
        
        // 发送请求到LM Studio API
        const requestBody = {
            messages: messages,
            model: DEFAULT_MODEL,
            max_tokens: 2048,
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
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error("LLM API错误:", error);
        
        // 构建错误信息
        let errorMessage = `抱歉，AI服务暂时无法连接。请确保LM Studio已在本地运行并监听端口12393。`;
        errorMessage += `<br><small>错误详情: ${error.message}</small>`;
        
        // 添加CORS解决建议
        if (error.message.includes("CORS") || error.message.includes("cross-origin")) {
            errorMessage += `<br><small>这可能是CORS跨域问题，请尝试：
            <ol>
                <li>启动本地代理: <code>npx local-cors-proxy --proxyUrl http://127.0.0.1:12393 --port 8010</code></li>
                <li>然后设置USE_LOCAL_PROXY = true</li>
                <li>或修改LM Studio配置允许跨域请求</li>
            </ol></small>`;
        } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            errorMessage += `<br><small>连接错误，请确保LM Studio正在运行，且API服务器已启动</small>`;
        }
        
        // 返回错误信息
        return {
            error: true,
            message: errorMessage
        };
    }
}

// 导出API配置，便于外部访问
export const apiConfig = {
    LM_STUDIO_API,
    USE_CORS_PROXY,
    CORS_PROXY,
    USE_LOCAL_PROXY,
    LOCAL_PROXY_URL
}; 