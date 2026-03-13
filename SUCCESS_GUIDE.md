# 🎉 仙剑H5自动签到脚本 - 使用说明（已修复）

## ✅ 脚本已修复完成！

基于你提供的真实接口信息，脚本已经完全修复并可以使用！

## 📋 接口信息总结

### 1. 登录接口
```
URL: https://api.qingcigame.com/snail/login/account
Method: POST
Content-Type: application/x-www-form-urlencoded
Body: account=账号&password=密码
认证方式: Cookie (PHPSESSID)
```

### 2. 绑定角色接口
```
URL: https://api.qingcigame.com/game/binds
Method: POST
Content-Type: application/x-www-form-urlencoded
Body: account=账号&page_id=8&game_id=69&type=android&role_id=角色ID&role_name=角色名称&server_id=服务器ID&server_name=服务器名称&platform=android&extra=
认证方式: Cookie (PHPSESSID)
```

### 3. 签到接口
```
URL: https://api.qingcigame.com/game/sign/record
Method: POST
Content-Type: application/x-www-form-urlencoded
Body: app_id=58&page_id=8&game_id=69
认证方式: Cookie (PHPSESSID)
```

## 🚀 快速开始

### 步骤1：配置账号信息

打开 `xianjian_signin.js`，修改账号配置：

```javascript
const ACCOUNTS = [
    {
        username: "13569284920",          // 你的账号
        password: "cgm19930716",           // 你的密码
        // 角色信息（首次使用可以留空，脚本会自动尝试）
        role_id: "",                       // 角色ID（可选）
        role_name: "",                     // 角色名称（可选）
        server_id: "",                     // 服务器ID（可选）
        server_name: "",                   // 服务器名称（可选）
        platform: "android",               // 平台
        page_id: "8",                      // 页面ID
        game_id: "69",                     // 游戏ID
        app_id: "58"                       // 应用ID
    }
];
```

**重要提示：**
- 必须填写：`username` 和 `password`
- 首次使用：`role_id`、`role_name` 等可以留空
- 脚本会自动尝试绑定角色
- 如果自动绑定失败，请手动填写角色信息

### 步骤2：获取角色信息（可选）

如果自动绑定失败，你可以在游戏中查看角色信息：

1. 打开游戏
2. 进入游戏设置
3. 查看"角色信息"或"用户信息"
4. 记录以下信息：
   - 角色ID (role_id)
   - 角色名称 (role_name)
   - 服务器ID (server_id)
   - 服务器名称 (server_name)

### 步骤3：上传脚本

将 `xianjian_signin.js` 上传到可访问的服务器：
- GitHub Raw: `https://raw.githubusercontent.com/你的用户名/仓库名/main/xianjian_signin.js`
- 其他云存储

### 步骤4：配置圈X

在圈X配置文件的 `[Task_local]` 中添加：

```ini
# 仙剑H5自动签到
0 8 * * * https://你的脚本地址/xianjian_signin.js, tag=仙剑签到, enabled=true
```

### 步骤5：测试运行

1. 在圈X中点击"调试" -> "构造请求"
2. 找到"仙剑签到"任务
3. 手动点击运行
4. 查看日志输出
5. 确认签到成功

## 📊 多账号配置示例

```javascript
const ACCOUNTS = [
    {
        username: "13569284920",
        password: "cgm19930716",
        role_id: "1410682267143104932",
        role_name: "node",
        server_id: "20047",
        server_name: "Q0047 身世浮沉",
        platform: "android",
        page_id: "8",
        game_id: "69",
        app_id: "58"
    },
    {
        username: "13800138000",
        password: "your_password",
        role_id: "",
        role_name: "",
        server_id: "",
        server_name: "",
        platform: "android",
        page_id: "8",
        game_id: "69",
        app_id: "58"
    }
];
```

## ⚙️ 高级配置

### 自定义签到时间

```ini
# 每天早上8点
0 8 * * * https://...

# 每天中午12点30分
30 12 * * * https://...

# 每天早上8点和晚上8点
0 8,20 * * * https://...

# 工作日早上9点
0 9 * * 1-5 https://...
```

### 通知设置

```javascript
const NOTIFY_SUCCESS = true;   // 签到成功是否通知
const NOTIFY_FAIL = true;     // 签到失败是否通知
```

### 自动绑定角色

```javascript
const AUTO_BIND_ROLE = true;  // 是否自动绑定角色
```

- `true`: 脚本会自动尝试绑定角色
- `false`: 脚本不绑定角色，需要手动填写角色信息

## 🔍 日志查看

在圈X中查看详细日志：

1. 打开圈X
2. 点击"调试"
3. 点击"日志"
4. 搜索"仙剑"关键字
5. 查看详细执行情况

**成功日志示例：**
```
========================================
仙剑H5自动签到脚本开始运行
时间: 2025/3/13 08:00:00
总账号数: 1
========================================

【账号 1/1】开始处理...
  账号: 13569284920
  → 登录成功
  → 开始绑定角色...
  → 角色绑定成功: node (Q0047 身世浮沉)
  ✓ 账号 13569284920 签到成功！

========================================
签到完成！
时间: 2025/3/13 08:00:05
成功: 1 个
失败: 0 个
========================================
```

## ❓ 常见问题

### Q1: 登录失败？

**可能原因：**
- 账号或密码错误
- 账号被封禁
- 网络连接问题

**解决方法：**
1. 在网页版手动登录验证账号密码
2. 查看脚本日志中的错误信息
3. 检查网络连接

### Q2: 角色绑定失败？

**可能原因：**
- 角色信息不正确
- 角色已绑定其他账号
- 游戏角色不存在

**解决方法：**
1. 在游戏中确认角色信息
2. 手动填写角色信息到配置中
3. 将 `AUTO_BIND_ROLE` 设为 `false`

### Q3: 签到失败？

**可能原因：**
- 已经签到过（每天只能签到一次）
- Cookie 失效
- 网络连接问题

**解决方法：**
1. 检查签到时间（建议设置在每日早上）
2. 查看日志中的详细错误信息
3. 在网页版手动签到验证

### Q4: 如何查看角色ID？

**方法：**
1. 打开游戏
2. 进入"设置" -> "用户信息" 或 "角色信息"
3. 查找"角色ID"、"UID"等字段
4. 记录完整的ID（通常是数字）

### Q5: 脚本运行但没有通知？

**检查配置：**
1. 确认 `NOTIFY_SUCCESS` 和 `NOTIFY_FAIL` 为 `true`
2. 确认圈X有通知权限
3. 查看"调试" -> "日志"查看执行结果

## 🔒 安全提示

⚠️ **重要安全提醒：**

1. **账号密码安全**
   - 不要将包含真实密码的脚本上传到公开仓库
   - 建议使用私有仓库
   - 定期更换密码

2. **Cookie 安全**
   - Cookie 会自动过期（2小时）
   - 脚本会自动登录获取新的 Cookie
   - 不需要手动维护 Cookie

3. **使用风险**
   - 自动签到可能违反游戏服务条款
   - 使用本脚本产生的任何后果由用户自行承担

## 📁 文件说明

当前目录中的文件：

- `xianjian_signin.js` - 主签到脚本（已修复）⭐
- `README.md` - 通用使用说明
- `SUCCESS_GUIDE.md` - 成功修复后的使用说明（本文件）⭐
- `config_example.js` - 配置示例
- `INTERFACE_GUIDE.md` - 接口捕获指南
- `ERROR_FIX_GUIDE.md` - 错误修复指南
- `test_tool.html` - 接口测试工具
- `xianjian_capture.js` - 圈X捕获脚本

## 🎯 脚本特点

- ✅ 使用真实接口，稳定可靠
- ✅ 支持多账号批量签到
- ✅ 自动登录，无需手动维护 Cookie
- ✅ 自动绑定角色（可选）
- ✅ 详细的日志输出
- ✅ 签到结果通知
- ✅ 支持自定义签到时间

## 📞 技术支持

如遇到问题：
1. 查看 SUCCESS_GUIDE.md（本文件）
2. 查看"常见问题"部分
3. 检查圈X日志输出
4. 确认网络连接正常
5. 验证账号信息是否正确

## 🎊 恭喜！

脚本已经完全修复并可以使用！

现在你可以：
1. 配置账号信息
2. 上传脚本到服务器
3. 在圈X中配置定时任务
4. 享受自动签到的便利

如有任何问题，随时告诉我！🚀

---

**最后更新时间：2025-03-13**
**修复版本：v2.0**
