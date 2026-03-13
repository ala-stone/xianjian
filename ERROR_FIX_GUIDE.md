# 错误修复指南 - JSONParse error

## 问题描述

你遇到了以下错误：
```
JSONParse error: Unrecognized token '<'
```

这个错误说明接口返回的不是 JSON 数据，而是 HTML 页面。这意味着我之前推断的接口地址 `https://h5.qingcigame.com/api/login` 不正确。

## 解决方案

请按照以下步骤之一获取真实的接口信息：

### 🔥 方案一：使用测试工具（最简单）

我为你创建了一个网页测试工具：

1. **打开测试工具**
   - 在浏览器中打开：`test_tool.html`
   - 这个文件已经创建在你的项目目录中

2. **测试登录接口**
   - 输入你的账号和密码
   - 点击"测试登录"
   - 查看返回结果

3. **如果测试失败**
   - 说明接口地址不正确
   - 需要使用方案二或方案三获取真实接口

### 📱 方案二：使用浏览器开发者工具（推荐）

这是最可靠的方法：

#### 步骤1：打开开发者工具
1. 在电脑浏览器（Chrome 或 Edge）中打开：
   https://h5.qingcigame.com/package/template/enter57nqi9z9xcn?app_id=58
2. 按 `F12` 键打开开发者工具
3. 点击"Network"（网络）标签

#### 步骤2：清除现有请求
1. 点击 Network 标签中的"清空"按钮（圆形箭头图标）
2. 准备捕获新的请求

#### 步骤3：捕获登录请求
1. 在页面中输入你的账号和密码
2. 点击"登录"按钮
3. 立即在 Network 标签中查看新出现的请求
4. 找到登录相关的请求（通常包含 `login`、`auth` 等关键字）
5. 点击该请求，查看详细信息

**需要记录的信息：**

```
📋 请求示例：

General：
  Request URL: https://xxx.xxx.com/xxx
  Request Method: POST
  Status Code: 200

Request Headers：
  Content-Type: application/json
  User-Agent: Mozilla/5.0...
  Accept: application/json
  （记录所有必要的 Headers）

Request Payload：
  {
    "account": "xxx",
    "password": "xxx",
    ...
  }

Response：
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      ...
    }
  }
```

#### 步骤4：捕获签到请求
1. 登录成功后，找到签到按钮
2. 点击签到
3. 在 Network 标签中查看新出现的请求
4. 找到签到相关的请求（通常包含 `signin`、`checkin` 等关键字）
5. 记录详细信息

**特别关注：**
- 签到请求的 URL
- 是否需要 token（通常在 Request Headers 的 Authorization 中）
- Request Body 的格式

### 📋 方案三：查看 INTERFACE_GUIDE.md

我已经创建了详细的接口捕获指南，文件位置：
- `INTERFACE_GUIDE.md`

这个指南包含：
- 详细的步骤说明
- 常见问题解答
- 需要获取的信息清单
- 示例格式

## 快速检查清单

在提交接口信息前，请确认：

- [ ] 能够在浏览器中手动登录成功
- [ ] 能够在浏览器中手动签到成功
- [ ] 已复制完整的请求 URL
- [ ] 已记录所有必需的 Headers（特别是 Content-Type 和 Authorization）
- [ ] 已记录请求体的完整格式和所有字段
- [ ] 已知道 token 的获取方式（从登录响应的哪个字段获取）
- [ ] 已知道 token 的使用方式（放在哪个 Header 中，格式如何）
- [ ] 已查看登录和签到成功的响应示例

## 需要提交的信息格式

请按照以下格式提供信息：

```javascript
=== 登录接口 ===
URL: https://api.example.com/user/login
Method: POST
Headers: {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0...",
  "Accept": "application/json"
}
Body: {
  "phone": "13800138000",
  "pwd": "password123"
}
成功响应: {
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "123456"
  }
}

=== 签到接口 ===
URL: https://api.example.com/activity/checkin
Method: POST
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Body: {
  "date": "2025-03-13"
}
成功响应: {
  "code": 200,
  "message": "签到成功",
  "data": {
    "consecutiveDays": 5
  }
}
```

## 常见问题

### Q1: Network 标签中请求太多，找不到登录请求？

**解决方法：**
1. 点击 Network 标签中的 "XHR/fetch" 过滤器（只显示 AJAX 请求）
2. 按 "Size" 或 "Time" 排序，查看最大的请求
3. 在登录按钮点击前后，观察哪个请求是新增的
4. 查看请求的 URL，通常包含 `login`、`auth`、`user` 等关键字
5. 点击请求，查看 Preview 或 Response，如果返回用户信息或 token，就是登录请求

### Q2: 找不到登录接口？

**可能原因：**
1. 登录可能通过多个请求完成（如获取验证码 -> 提交登录）
2. 可能使用 WebSocket 或其他特殊协议
3. 可能需要特殊的 Headers 或加密参数

**解决方法：**
1. 记录登录过程中的所有请求
2. 查看每个请求的 Response，找出返回 token 或用户信息的请求
3. 如果仍然找不到，可以告诉我你看到的所有请求

### Q3: 不知道 token 在哪里？

**查看登录成功的响应：**
- 点击登录请求
- 查看 "Response" 或 "Preview" 标签
- 寻找包含 `token`、`access_token`、`session`、`auth` 等关键字的字段
- 记录完整的 token 值

### Q4: 签到接口需要 token，但不知道怎么传？

**查看登录后的请求：**
1. 登录成功后，在页面中点击其他操作（如签到）
2. 查看 Network 中的新请求
3. 查看请求的 Headers，找到包含 token 的 Header（通常是 Authorization）
4. 记录格式，如：
   - `Authorization: Bearer xxx`
   - `token: xxx`
   - 或在 Cookie 中

## 临时替代方案

如果你暂时无法获取接口信息，可以使用以下方法：

### 方法1：手动签到提醒
我可以帮你创建一个简单的脚本，每天发送通知提醒你手动签到。

### 方法2：使用 Auto.js 自动化
如果你使用 Android 手机，可以使用 Auto.js 模拟点击操作来实现自动签到。

## 下一步操作

请选择以下一种方式：

1. **使用测试工具**：打开 `test_tool.html` 测试接口
2. **使用浏览器开发者工具**：按照上述步骤捕获真实接口
3. **参考详细指南**：查看 `INTERFACE_GUIDE.md` 获取更多信息

获取到接口信息后，请发送给我，我会立即修改脚本，确保能够正常使用。

## 文件清单

当前目录中的文件：
- `xianjian_signin.js` - 主签到脚本（需要修改接口）
- `README.md` - 使用说明
- `config_example.js` - 配置示例
- `INTERFACE_GUIDE.md` - 详细接口捕获指南
- `xianjian_capture.js` - 圈X接口捕获脚本
- `test_tool.html` - 网页测试工具
- `ERROR_FIX_GUIDE.md` - 本错误修复指南

## 联系我

如果你：
- 无法捕获到接口信息
- 需要帮助理解某个步骤
- 发现其他问题

请告诉我，我会进一步帮助你！
