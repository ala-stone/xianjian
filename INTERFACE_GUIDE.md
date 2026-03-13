# 如何捕获真实接口信息

由于接口地址可能不正确，我们需要手动捕获真实的请求。请按照以下步骤操作：

## 方法一：使用圈X捕获（推荐）

### 步骤1：配置圈X重写

1. 打开 Quantumult X
2. 点击右下角的配置文件图标（小风车）
3. 点击"配置文件编辑"
4. 找到 `[rewrite_local]` 部分，添加以下配置：

```ini
# 捕获仙剑H5所有请求
^https://h5\.qingcigame\.com/package/template/enter57nqi9z9xcn url script-request-body https://你的脚本路径/xianjian_capture.js
```

5. 找到 `[mitm]` 部分，添加：

```ini
hostname = h5.qingcigame.com
```

6. 保存配置

### 步骤2：启用 HTTPS 解密

1. 打开圈X
2. 点击"MITM"选项卡
3. 确保"HTTPS 解密"已开启
4. 安装证书（如果未安装）

### 步骤3：安装圈X证书

如果还没有安装证书：

1. 在圈X中点击"MITM"
2. 点击"生成证书"（如果需要）
3. 点击"安装证书"
4. 按照提示安装并信任证书
5. 在手机"设置"->"通用"->"关于本机"->"证书信任设置"中，开启圈X证书的信任

### 步骤4：捕获请求

1. 确保圈X已开启重写功能（在"重写"选项卡中开启）
2. 使用 Safari 浏览器打开：https://h5.qingcigame.com/package/template/enter57nqi9z9xcn?app_id=58
3. 输入账号密码登录
4. 如果有签到按钮，点击签到
5. 返回圈X，点击"调试"->"日志"
6. 查看捕获的请求信息

### 步骤5：提取接口信息

从日志中找到以下信息：

**登录请求示例（需要找到类似的）：**
```
URL: https://api.xxx.com/login
Method: POST
Headers: {
  "Content-Type": "application/json",
  ...
}
Body: {
  "account": "xxx",
  "password": "xxx"
}
```

**签到请求示例（需要找到类似的）：**
```
URL: https://api.xxx.com/signin
Method: POST
Headers: {
  "Authorization": "Bearer xxx",
  ...
}
Body: {...}
```

## 方法二：使用浏览器开发者工具

### 步骤1：打开开发者工具

1. 在电脑浏览器（Chrome 或 Safari）中打开：
   https://h5.qingcigame.com/package/template/enter57nqi9z9xcn?app_id=58
2. 按 `F12` 或 `Cmd+Option+I`（Mac）打开开发者工具
3. 点击"Network"（网络）选项卡

### 步骤2：捕获登录请求

1. 在页面中输入账号密码
2. 点击登录
3. 在 Network 选项卡中查看出现的请求
4. 找到登录相关的请求（通常包含 `login`、`auth` 等关键字）
5. 点击该请求，查看详细信息：
   - **Request URL**: 请求地址
   - **Request Method**: 请求方法（GET/POST）
   - **Request Headers**: 请求头
   - **Request Payload**: 请求体（POST 请求）

**记录以下信息：**
- 完整的 URL
- 请求方法
- 必需的 Headers（特别是 Content-Type、Authorization 等）
- 请求体的格式和字段

### 步骤3：捕获签到请求

1. 登录成功后，找到签到按钮
2. 点击签到
3. 在 Network 选项卡中查看新出现的请求
4. 找到签到相关的请求（通常包含 `signin`、`checkin` 等关键字）
5. 记录详细信息

**特别关注：**
- 是否需要 token 或 session
- token 在 Headers 中的位置和格式
- 请求体的具体字段

## 方法三：使用 Charles/Fiddler 抓包

### Charles 配置

1. 下载并安装 Charles
2. 配置 SSL 代理：
   - Help -> SSL Proxying -> Install Charles Root Certificate
3. 添加 SSL 代理规则：
   - Proxy -> SSL Proxying Settings
   - Add: `*.qingcigame.com:443`
4. 手机连接电脑代理
5. 在手机上打开网页并操作
6. 在 Charles 中查看捕获的请求

## 需要获取的关键信息

无论使用哪种方法，你需要获取以下信息：

### 1. 登录接口

```
URL: [完整的登录接口地址]
Method: [POST/GET]
Headers: {
  "Content-Type": "application/json",
  "User-Agent": "...",
  "其他必要的头..."
}
Body: {
  "字段1": "值1",
  "字段2": "值2",
  ...
}
```

### 2. 签到接口

```
URL: [完整的签到接口地址]
Method: [POST/GET]
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer xxx",  // 或其他认证方式
  "User-Agent": "...",
  ...
}
Body: {
  "字段1": "值1",
  ...
}
```

### 3. 认证信息

- token 的获取方式
- token 的位置（Header 或 Body）
- token 的格式（Bearer xxx, xxx=yyy 等）
- 是否需要其他认证信息（如 cookie, session）

## 获取到接口信息后

将捕获到的信息发送给我，我会帮你修改脚本。请提供：

1. ✅ 登录接口的完整 URL
2. ✅ 登录请求的 Method
3. ✅ 登录请求的 Headers（特别是 Content-Type）
4. ✅ 登录请求的 Body 格式和字段
5. ✅ 签到接口的完整 URL
6. ✅ 签到请求的 Method
7. ✅ 签到请求的 Headers（特别是认证信息）
8. ✅ 签到请求的 Body 格式
9. ✅ 成功登录后的响应示例（包含 token 的位置）

## 快速检查清单

在提交信息前，请确认：

- [ ] 能够在浏览器中手动登录成功
- [ ] 能够在浏览器中手动签到成功
- [ ] 已复制完整的 URL（包括参数）
- [ ] 已记录所有必需的 Headers
- [ ] 已记录请求体的完整格式
- [ ] 已知道 token 的获取和使用方式
- [ ] 已查看登录和签到成功的响应示例

## 示例格式

请按照以下格式提供信息：

```
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

### Q: 为什么捕获到的请求很多？

A: 网页会发送很多请求（图片、CSS、JS、统计等），你需要：
1. 筛选 XHR/Fetch 请求
2. 查找包含 `login`、`signin`、`checkin` 等关键字的请求
3. 查看 Request URL 和 Response，判断哪个是你需要的

### Q: 没有看到登录请求？

A: 可能原因：
1. 页面使用 WebSocket 或其他特殊协议
2. 登录是通过多个请求完成的
3. 需要先获取验证码等前置请求

### Q: 不知道哪个是登录请求？

A: 判断方法：
1. 在 Network 中按时间排序
2. 在登录按钮点击后立即出现的请求
3. 查看 Response，如果包含 token 或用户信息，就是登录请求
4. 查看 Status Code，成功的请求通常是 200

### Q: token 在哪里？

A: 查看登录成功的响应：
- 可能在 Response Body 的某个字段中（如 `token`, `access_token`）
- 可能在 Response Headers 中（如 `Set-Cookie`）
- 也可能在后续的某个请求中传递

## 联系方式

获取到接口信息后，请按上述格式整理并发送给我，我会立即帮你修改脚本并重新生成可用的版本。
