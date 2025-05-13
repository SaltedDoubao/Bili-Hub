# 仿Porn Hub风格的bilibili页面(无实际功能)

这是一个在Web前端开发课程中诞生的项目，旨在制作一个影视相关的网站首页。

一开始只是想做点什么能让人"眼前一亮"，冥思苦想之下，最后做出了这个让人”眼前一黑“（指页面主题是黑色.doge）的东西

该项目是一个简单的静态HTML和CSS实现的仿国外某著名视频网站风格的首页。

## ✏️ 项目简介 (Project Introduction) / 如何开始 (Getting Started)

这是一个基于 HTML, CSS, 和 JavaScript 构建的视频网站首页静态演示页面。视频卡片数据从本地 `videos.json` 文件动态加载。

**运行步骤：**

1.  **确保文件完整：**
    * 确保您已拥有项目的所有文件
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


## 👀 预览

![预览图片](./static/images/preview(1).png)

![预览图片](./static/images/preview(2).png)

## ⚠️ 注意

部分内容由AIGC生成，请注意辨别。

## 🚧 施工规划 (未来会加入的功能)

● 鼠标指针悬停于搜索栏时，显示搜索历史

● 当指针悬停于视频封面时，预览视频的功能

● 鼠标指针悬停于用户头像时，悬浮菜单显示用户信息

● 顶栏最左侧二级菜单(目前不知道可以拿来干啥)

● 自动获取b站用户头像文件(或者说能否自动获取对应图像url?)

● 多页面切换功能

● 自动获取视频封面url等信息填入json

## 🏛️许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源许可证。

## 📞联系方式

邮箱：salteddoubao@gmail.com
QQ：1531895767
