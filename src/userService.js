// 用户数据服务模块
// 提供用户注册、登录验证、数据存储功能

// 模拟数据存储
// 实际应用中应使用后端数据库或本地文件存储
// 这里使用 localStorage 作为数据存储方式

// 初始化用户数据
function initUserData() {
    // 检查用户数据是否已经初始化
    if (!localStorage.getItem('biliHubUsers')) {
        // 创建默认用户
        const defaultUsers = [
            {
                username: 'admin',
                password: 'admin123',
                nickname: '管理员',
                avatar: '../res/images/avatar/avatar1.png',
                email: 'admin@bilibili.com',
                registerDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                username: 'test',
                password: 'test123',
                nickname: '测试用户',
                avatar: '../res/images/avatar/avatar2.png',
                email: 'test@bilibili.com',
                registerDate: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            }
        ];
        
        // 保存到 localStorage
        localStorage.setItem('biliHubUsers', JSON.stringify(defaultUsers));
        console.log('用户数据初始化完成');
    }
}

// 导出用户数据到CSV文件
function exportUsersToCsv() {
    try {
        const users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        
        // 创建CSV表头
        let csvContent = "用户名,昵称,邮箱,注册日期,最后登录\n";
        
        // 添加用户数据
        users.forEach(user => {
            // 格式化日期
            const registerDate = new Date(user.registerDate).toLocaleDateString();
            const lastLogin = new Date(user.lastLogin).toLocaleDateString();
            
            // 添加一行数据
            csvContent += `${user.username},${user.nickname},${user.email},${registerDate},${lastLogin}\n`;
        });
        
        // 创建Blob对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // 创建下载链接
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        // 设置下载属性
        link.setAttribute("href", url);
        link.setAttribute("download", "bili_hub_users.csv");
        link.style.visibility = 'hidden';
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error("导出用户数据失败:", error);
        return false;
    }
}

// 导入CSV用户数据
function importUsersFromCsv(csvText) {
    try {
        // 分割CSV行
        const rows = csvText.split('\n');
        
        // 去掉表头
        const dataRows = rows.slice(1);
        
        // 当前用户
        const currentUsers = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        
        // 解析每一行数据
        dataRows.forEach(row => {
            if (!row.trim()) return; // 跳过空行
            
            const [username, nickname, email, registerDate, lastLogin] = row.split(',');
            
            // 检查用户是否已存在
            const existingUser = currentUsers.find(u => u.username === username);
            
            if (existingUser) {
                // 更新已有用户
                existingUser.nickname = nickname;
                existingUser.email = email;
                // 不更新密码和头像
            } else {
                // 添加新用户，使用随机密码
                const randomPassword = Math.random().toString(36).substring(2, 10);
                
                currentUsers.push({
                    username,
                    password: randomPassword, // 导入时设置随机密码
                    nickname,
                    email,
                    avatar: '../res/images/avatar/default.png',
                    registerDate: new Date(registerDate).toISOString() || new Date().toISOString(),
                    lastLogin: new Date(lastLogin).toISOString() || new Date().toISOString()
                });
            }
        });
        
        // 保存更新后的用户数据
        localStorage.setItem('biliHubUsers', JSON.stringify(currentUsers));
        
        return true;
    } catch (error) {
        console.error("导入用户数据失败:", error);
        return false;
    }
}

// 用户注册函数
function registerUser(userData) {
    try {
        // 读取现有用户
        const users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        
        // 检查用户名是否已存在
        if (users.some(user => user.username === userData.username)) {
            return {
                success: false,
                message: '用户名已存在'
            };
        }
        
        // 检查邮箱是否已存在
        if (userData.email && users.some(user => user.email === userData.email)) {
            return {
                success: false,
                message: '邮箱已被注册'
            };
        }
        
        // 创建新用户对象
        const newUser = {
            username: userData.username,
            password: userData.password,
            nickname: userData.nickname || userData.username,
            email: userData.email || '',
            avatar: userData.avatar || '../res/images/avatar/default.png',
            registerDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // 添加到用户列表
        users.push(newUser);
        
        // 保存更新后的用户列表
        localStorage.setItem('biliHubUsers', JSON.stringify(users));
        
        return {
            success: true,
            message: '注册成功',
            user: {
                username: newUser.username,
                nickname: newUser.nickname,
                avatar: newUser.avatar
            }
        };
    } catch (error) {
        console.error("注册用户失败:", error);
        return {
            success: false,
            message: '注册失败: ' + error.message
        };
    }
}

// 用户登录验证
function loginUser(username, password) {
    try {
        // 读取用户列表
        const users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        
        // 查找用户
        const user = users.find(u => u.username === username);
        
        // 用户不存在
        if (!user) {
            return {
                success: false,
                message: '用户名不存在'
            };
        }
        
        // 密码不匹配
        if (user.password !== password) {
            return {
                success: false,
                message: '密码错误'
            };
        }
        
        // 更新最后登录时间
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('biliHubUsers', JSON.stringify(users));
        
        // 登录成功，返回用户信息（不包含敏感信息）
        return {
            success: true,
            message: '登录成功',
            user: {
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar,
                email: user.email
            }
        };
    } catch (error) {
        console.error("用户登录失败:", error);
        return {
            success: false,
            message: '登录失败: ' + error.message
        };
    }
}

// 获取用户资料
function getUserProfile(username) {
    try {
        const users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return null;
        }
        
        // 返回不包含密码的用户信息
        return {
            username: user.username,
            nickname: user.nickname,
            avatar: user.avatar,
            email: user.email,
            registerDate: user.registerDate,
            lastLogin: user.lastLogin
        };
    } catch (error) {
        console.error("获取用户资料失败:", error);
        return null;
    }
}

// 更新用户资料
function updateUserProfile(username, profileData) {
    try {
        const users = JSON.parse(localStorage.getItem('biliHubUsers') || '[]');
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: '用户不存在'
            };
        }
        
        // 更新用户资料（不允许更改用户名）
        const user = users[userIndex];
        
        // 允许更新的字段
        if (profileData.nickname) user.nickname = profileData.nickname;
        if (profileData.email) user.email = profileData.email;
        if (profileData.avatar) user.avatar = profileData.avatar;
        if (profileData.password) user.password = profileData.password;
        
        // 保存更新
        localStorage.setItem('biliHubUsers', JSON.stringify(users));
        
        return {
            success: true,
            message: '资料更新成功'
        };
    } catch (error) {
        console.error("更新用户资料失败:", error);
        return {
            success: false,
            message: '更新失败: ' + error.message
        };
    }
}

// 模块初始化
initUserData();

// 导出模块函数
export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    exportUsersToCsv,
    importUsersFromCsv
}; 