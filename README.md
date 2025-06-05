# 仿Porn Hub风格的bilibili页面(暂不支持推送视频)

> **重要声明：本项目仅供教育和学习目的，作为Web前端开发课程的实践项目。不用于任何商业用途。**

这是一个在Web前端开发课程中诞生的项目，旨在制作一个影视相关的网站首页。

一开始只是想做点什么能让人"眼前一亮"，冥思苦想之下，最后做出了这个让人"眼前一黑"（指页面主题是黑色.doge）的东西

该项目是一个简单的静态HTML和CSS实现的仿国外某著名视频网站风格的首页。

## ✏️ 项目简介 (Project Introduction) / 如何开始 (Getting Started)

这是一个基于 HTML, CSS, 和 JavaScript 构建的视频网站首页静态演示页面。视频卡片数据从本地 `videos.json` 文件动态加载。

**运行步骤：**

1.  **获取项目文件：**
    * 通过git clone获取项目文件
    * 确保这些文件和文件夹保持正确的相对路径结构

2.  **使用本地 Web 服务器运行：**
    * 由于本项目使用 JavaScript 的 `Workspace` API 从 `videos.json` 加载数据，直接通过 `file:///` 协议在浏览器中打开 `index.html` **将无法正常工作**（会导致 CORS 或文件访问错误，无法加载视频数据）。
    * 您**必须**通过一个本地 HTTP 服务器来运行此项目。

    **推荐的本地服务器启动方法（选择一种）：**

    * **方法 A: 使用提供的 BAT 脚本:**
        1.  将 `start_server.bat` 文件放置在项目的**根目录**。
        2.  双击运行 `start_server.bat`。
        3.  脚本会自动启动 Python HTTP 服务器并在浏览器中打开 `http://localhost:8000`。

    * **方法 B: 手动使用 Python 内置 HTTP 服务器:**
        1.  确保您的电脑已安装 Python。

        2.  打开命令行/终端，使用 `cd` 命令进入项目的**根目录**

        3.  执行命令: `python3 -m http.server 8000` 或 `python -m SimpleHTTPServer 8000`

3.  **查看页面：**
    一旦本地服务器成功运行，您的浏览器应该会自动打开或您可以手动访问指定的 `http://localhost:8000/src/` 或 `http://localhost:8000/src/index.html` 地址来查看项目首页。

## 📂 项目结构

本项目采用模块化的结构组织代码，主要分为以下几个部分：

```
Bili-Hub/
│
├── src/                  # 源代码目录
│   ├── index.html        # 网站首页
│   ├── style.css         # 主样式文件
│   ├── script.js         # 首页主要脚本
│   │
│   ├── message.html      # 消息页面
│   ├── message.css       # 消息页面样式
│   ├── message.js        # 消息页面脚本
│   │
│   ├── userpage.html     # 用户主页
│   ├── userpage.css      # 用户主页样式
│   ├── userpage.js       # 用户主页脚本
│   │
│   ├── login.html        # 登录页面
│   ├── login.css         # 登录/注册共用样式
│   ├── login.js          # 登录页面脚本
│   │
│   ├── register.html     # 注册页面
│   ├── register.js       # 注册页面脚本
│   │
│   ├── admin.html        # 管理员页面
│   ├── admin.js          # 管理员页面脚本
│   │
│   ├── apiService.js     # API服务模块，处理LM Studio API调用
│   ├── userService.js    # 用户服务模块，处理用户相关功能
│   ├── chatData.js       # 聊天数据管理模块
│   ├── search.js         # 搜索功能模块
│   │
│   ├── videos.json       # 视频数据
│   └── carousel.json     # 轮播图数据
│
├── res/                  # 资源文件目录
│   └── images/           # 图片资源
│
├── start_web_server.bat  # Windows启动脚本
├── start_web_server.sh   # Linux/Mac启动脚本
├── start_cors_proxy.bat  # CORS代理启动脚本
├── LICENSE               # MIT许可证
└── README.md             # 项目说明文档
```

### 核心功能模块说明

1. **首页模块** - `index.html`, `style.css`, `script.js`
   * 实现视频卡片的动态加载和展示
   * 轮播图功能
   * 顶部导航栏和侧边栏

2. **消息聊天模块** - `message.html`, `message.css`, `message.js`, `chatData.js`, `apiService.js`
   * 实现与AI助手的多角色对话功能
   * 使用LM Studio API进行本地大语言模型对话
   * 聊天历史记录管理

3. **用户相关模块** - `login.html`, `register.html`, `userpage.html`, `userService.js`
   * 用户注册和登录功能
   * 用户个人主页
   * 用户数据管理

4. **管理系统模块** - `admin.html`, `admin.js`
   * 用户管理功能
   * 数据导入导出功能

5. **数据模块** - `videos.json`, `carousel.json`
   * 存储视频卡片数据
   * 存储轮播图数据

## 🤖 使用LM Studio本地AI多角色聊天功能

本项目包含一个聊天功能，可以连接本地运行的LM Studio API以实现AI聊天。项目支持三种不同角色的AI对话体验。

**设置步骤：**

1. **下载并安装LM Studio**
   * 从[LM Studio官网](https://lmstudio.ai/)下载并安装LM Studio
   * 导入一个支持聊天功能的大语言模型（推荐使用gemma-3-4b-it-qat或其他同等能力的模型）

2. **启动LM Studio API服务器**
   * 在LM Studio中加载您选择的模型
   * 点击"本地服务器"标签
   * 启动本地API服务器（默认端口为12393）

3. **启动CORS代理服务器**
   * 确保您的电脑已经安装node.js，且已经安装local-cors-proxy
   ```
   npm install -g local-cors-proxy
   ```
   * 在命令行中运行以下命令：
   ```
   npx local-cors-proxy --proxyUrl http://127.0.0.1:12393 --port 8010
   ```
   * 或者双击运行项目根目录中的`start_cors_proxy.bat`脚本

4. **使用聊天功能**
   * 在网站中进入消息页面
   * 选择不同的聊天对象体验不同角色的AI对话：
     * **Gemma3** - AI助手角色，友好活泼，了解二次元文化
     * **B站用户** - 热情的B站用户和UP主，使用二次元网络用语
     * **哔哩哔哩官方** - 专业的客服代表，提供官方指导和帮助

5. **自定义角色提示词**
   * 可以在`src/apiService.js`文件中的`ROLE_PROMPTS`对象中修改各角色的提示词
   * 每个角色的提示词都可以根据需要调整，以创造不同的对话风格和专业知识领域

**故障排除：**

* 如果连接失败，请确保：
  * LM Studio正在运行且API服务器已启动
  * CORS代理服务器正在运行
  * 端口设置正确（LM Studio使用12393，代理使用8010）
  * 如果使用其他端口，请在`src/apiService.js`文件中更新相应设置
  * 检查浏览器控制台是否有CORS相关错误

* 模型选择建议：
  * 最佳体验需要一个支持角色扮演的大语言模型
  * 较小的模型（如3B-7B参数的模型）通常足够用于本项目的聊天功能
  * 可以在`src/apiService.js`中修改`DEFAULT_MODEL`变量来使用其他模型

## 👀 预览

![预览图片](./res/images/preview(1).png)

![预览图片](./res/images/preview(2).png)

## 🚧 施工规划 (未来会加入的功能)

● 当指针悬停于视频封面时，预览视频的功能

● 自动获取b站用户头像文件(或者说能否自动获取对应图像url?)

● 改进AI聊天功能，支持更多模型和角色设定

● 添加聊天记录导出和导入功能

● 优化移动端适配体验

## ⚠️ 注意

部分内容由AIGC生成，请注意辨别。

**免责声明：**
* 本项目仅作为前端技术学习与展示，与Pornhub和哔哩哔哩(Bilibili)官方没有任何关联。
* 项目中使用的任何商标、标识或设计元素仅用于学习和教育目的，不代表对相关品牌的任何认可或附属关系。
* 本项目不存储、分发或提供任何受版权保护的内容，仅作为前端界面设计练习。
* 如有任何侵权问题，请联系作者立即删除相关内容。

## 🏛️许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源许可证。

## 📞联系方式

邮箱：
```
salteddoubao@gmail.com
```
QQ：
```
1531895767
```

BiliBili：[椒盐豆包](https://space.bilibili.com/498891142)