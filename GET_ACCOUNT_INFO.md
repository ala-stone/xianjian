# 如何获取账号信息配置参数

## 概述

要配置多账号自动签到，需要为每个账号填写完整的参数信息。本指南介绍如何获取这些参数。

## 获取账号信息的方法

### 方法一：使用圈X抓包功能（推荐）

**步骤：**

1. **在圈X中开启抓包功能**
   - 打开圈X设置
   - 进入"MITM"设置
   - 启用HTTPS解密
   - 添加主机名：`h5.qingcigame.com` 和 `api.qingcigame.com`

2. **在游戏中操作账号**
   - 打开游戏（使用微信或浏览器）
   - 登录你的游戏账号
   - 进入游戏，确保角色已创建

3. **在圈X中查看抓包记录**
   - 打开圈X的"抓包"页面
   - 搜索关键词：`/snail/login/account`
   - 找到登录请求并查看详情

4. **从登录请求中提取信息**

   **登录请求信息：**
   ```
   URL: https://api.qingcigame.com/snail/login/account
   Method: POST
   Body: account=13569284920&password=your_password
   ```
   - `username`: Body中的`account`参数值
   - `password`: Body中的`password`参数值

5. **搜索角色绑定请求**
   - 搜索关键词：`/game/binds`
   - 找到角色绑定请求并查看详情

   **角色绑定请求信息：**
   ```
   URL: https://api.qingcigame.com/game/binds
   Method: POST
   Body: account=13569284920&page_id=8&game_id=69&type=android&role_id=1410682267143104932&role_name=node&server_id=20047&server_name=Q0047%20%E8%BA%AB%E4%B8%96%E6%B5%AE%E6%B2%89&platform=android&extra=
   ```
   从这个请求中提取：
   - `role_id`: `1410682267143104932`
   - `role_name`: `node`
   - `server_id`: `20047`
   - `server_name`: `Q0047 身世浮沉`（URL解码后）
   - `platform`: `android`
   - `page_id`: `8`
   - `game_id`: `69`

6. **获取app_id**
   - 通常固定为 `58`
   - 也可以从游戏URL中获取：`https://h5.qingcigame.com/package/template/enter57nqi9z9xcn?app_id=58`

### 方法二：使用浏览器开发者工具

**步骤：**

1. **打开游戏网页**
   ```
   https://h5.qingcigame.com/package/template/enter57nqi9z9xcn?app_id=58
   ```

2. **打开开发者工具**
   - Chrome/Edge: 按 `F12` 或 `Ctrl+Shift+I`
   - Safari: `Cmd+Option+I`

3. **切换到 Network 标签**
   - 选择"Network"标签
   - 筛选XHR/Fetch请求

4. **登录并观察网络请求**
   - 在游戏中登录账号
   - 找到 `/snail/login/account` 请求
   - 找到 `/game/binds` 请求

5. **查看请求详情**
   - 点击请求
   - 查看"Payload"或"Form Data"
   - 复制相关参数

### 方法三：从游戏内查看

**部分信息可以在游戏内直接获取：**

1. **角色名称（role_name）**
   - 在游戏主界面查看角色信息
   - 通常显示在左上角

2. **服务器名称（server_name）**
   - 在游戏登录界面查看服务器列表
   - 选择时可以看到服务器名称

**但以下信息仍需通过抓包获取：**
- role_id（角色ID）
- server_id（服务器ID）
- 其他技术参数

## 参数对照表

| 配置参数 | 对应请求参数 | 获取位置 | 示例值 |
|---------|-------------|---------|--------|
| `username` | `account` | `/snail/login/account` body | "13569284920" |
| `password` | `password` | `/snail/login/account` body | "cgm19930716" |
| `role_id` | `role_id` | `/game/binds` body | "1410682267143104932" |
| `role_name` | `role_name` | `/game/binds` body | "node" |
| `server_id` | `server_id` | `/game/binds` body | "20047" |
| `server_name` | `server_name` | `/game/binds` body | "Q0047 身世浮沉" |
| `platform` | `platform` | `/game/binds` body | "android" |
| `page_id` | `page_id` | `/game/binds` body | "8" |
| `game_id` | `game_id` | `/game/binds` body | "69" |
| `app_id` | URL参数 | 游戏URL | "58" |

## 多账号配置示例

假设你已获取了两个账号的信息，配置如下：

```javascript
const ACCOUNTS = [
    // 第一个账号
    {
        username: "13800138000",
        password: "your_password_1",
        role_id: "1410682267143104932",
        role_name: "剑客小强",
        server_id: "20047",
        server_name: "Q0047 身世浮沉",
        platform: "android",
        page_id: "8",
        game_id: "69",
        app_id: "58"
    },
    // 第二个账号
    {
        username: "13800138001",
        password: "your_password_2",
        role_id: "1410682267143104933",
        role_name: "法师阿珍",
        server_id: "20048",
        server_name: "Q0048 新手区",
        platform: "ios",
        page_id: "8",
        game_id: "69",
        app_id: "58"
    }
];
```

## 常见问题

### Q1: 为什么需要 role_id 和 server_id？

**A:** 这些是游戏服务器识别账号和角色的唯一标识符。没有这些信息，签到API无法确定是哪个账号在进行签到。

### Q2: 如果我不知道服务器信息怎么办？

**A:** 必须通过抓包获取。这是获取准确信息的唯一可靠方式。

### Q3: 同一个账号在不同服务器上有角色怎么办？

**A:** 需要为每个角色单独配置一个账号条目。同一个游戏账号在不同服务器上的角色有不同的 role_id。

### Q4: platform 参数重要吗？

**A:** 是的。通常为 "android" 或 "ios"。如果填错可能导致请求失败。

### Q5: page_id、game_id、app_id 每个账号都一样吗？

**A:** 通常是一样的，除非游戏有特殊设置。建议每个账号都填写相同的值。

### Q6: 如何验证配置是否正确？

**A:**
1. 上传脚本到圈X
2. 手动运行一次
3. 查看日志输出
4. 如果成功签到，说明配置正确

## 抓包工具推荐

| 工具 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Quantumult X** | 集成在签到环境中 | 需要购买 | 圈X用户（最推荐） |
| **Charles** | 功能强大 | 付费 | 专业调试 |
| **Fiddler** | 免费 | Windows为主 | Windows用户 |
| **Whistle** | 免费、功能全 | 配置稍复杂 | 开发者 |

## 安全提醒

⚠️ **重要提示：**

1. **不要公开分享包含真实密码的配置**
2. **建议将脚本放在私有仓库或服务器**
3. **定期更换密码**
4. **不要在公共网络上传输账号信息**
5. **如果可能，使用两步验证的账号**

## 快速检查清单

配置完成后，请检查以下内容：

- [ ] 所有必填参数都已填写
- [ ] role_id 和 server_id 通过抓包获取
- [ ] 密码正确（可以先手动登录验证）
- [ ] platform 填写正确（android/ios）
- [ ] JSON 格式正确（没有多余的逗号）
- [ ] 账号信息之间用逗号分隔
- [ ] 数组最后没有多余逗号

## 需要帮助？

如果仍然无法获取账号信息，可以：

1. 查看 `xianjian_capture.js` 文件，了解如何使用脚本捕获网络请求
2. 参考 `ERROR_FIX_GUIDE.md` 了解常见错误
3. 查看 `SUCCESS_GUIDE.md` 了解成功的日志格式
