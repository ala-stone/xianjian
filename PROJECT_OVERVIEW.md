# 仙剑H5自动签到脚本 - 项目概览

## 📁 项目结构

```
xianjian/
├── 📄 README.md                      # 项目说明文档（已更新）
├── 📄 UPDATE_NOTICE.md               # v1.1 更新通知（新增）
├── 📄 UPDATE_SUMMARY_V1.1.md         # v1.1 更新总结（新增）
├── 📄 MULTI_ACCOUNT_FIX.md           # 多账号修复说明（新增）
├── 📄 MULTI_ACCOUNT_QUICK_START.md   # 多账号快速开始（新增）
├── 📄 GET_ACCOUNT_INFO.md            # 获取账号信息指南（新增）
├── 📄 ERROR_FIX_GUIDE.md             # 错误排查指南
├── 📄 SUCCESS_GUIDE.md               # 成功案例参考
├── 📄 INTERFACE_GUIDE.md            # 接口详细说明
├── 📄 config_example.js             # 配置示例文件（已更新）
│
├── 🔧 脚本文件
│   ├── xianjian_signin_final.js     # ✅ 最终版本（v1.1，推荐使用）
│   ├── xianjian_signin.js           # 旧版本（保留）
│   ├── xianjian_signin_v3.js        # 实验版本 v3
│   ├── xianjian_signin_v4.js        # 实验版本 v4
│   ├── xianjian_signin_debug.js     # 调试版本
│   └── xianjian_capture.js          # 抓包辅助脚本
│
└── 🧪 工具文件
    └── test_tool.html               # 测试工具
```

---

## 📖 文档导航

### 新手入门

1. **README.md** - 从这里开始
   - 了解脚本功能
   - 基本使用步骤
   - 快速上手指南

2. **MULTI_ACCOUNT_QUICK_START.md** - 快速配置
   - 4步快速配置
   - 运行效果预览
   - 配置检查清单

### 配置指南

3. **GET_ACCOUNT_INFO.md** - 获取账号信息
   - 三种获取方法
   - 抓包详细步骤
   - 参数说明对照表

4. **config_example.js** - 配置示例
   - 完整参数配置
   - 多账号配置示例
   - Cron时间配置

### 问题排查

5. **ERROR_FIX_GUIDE.md** - 错误排查
   - 常见错误及解决方法
   - JSONParse错误
   - 登录失败处理

6. **SUCCESS_GUIDE.md** - 成功案例
   - 正确的日志格式
   - 成功配置示例

### 更新说明

7. **UPDATE_NOTICE.md** - 更新通知 ⭐
   - v1.1 更新内容
   - 如何更新
   - 常见问题

8. **MULTI_ACCOUNT_FIX.md** - 多账号修复详情
   - 问题描述
   - 修复过程
   - 代码变更说明

9. **UPDATE_SUMMARY_V1.1.md** - 完整更新总结
   - 技术细节
   - 文件变更清单
   - 后续计划

### 技术文档

10. **INTERFACE_GUIDE.md** - 接口说明
    - API端点详情
    - 请求参数说明
    - 响应格式解析

---

## 🚀 脚本版本说明

### v1.1 - 最终版本（推荐）✅

**文件**: `xianjian_signin_final.js`

**特点**:
- ✅ 完整的多账号支持
- ✅ 智能检查签到状态
- ✅ 详细的日志输出
- ✅ 账号进度显示
- ✅ 统计所有账号结果

**适用场景**:
- 所有用户（推荐使用）
- 多账号签到（必须使用）

**状态**: 稳定版本，持续维护

---

### v1.0 - 旧版本

**文件**: `xianjian_signin.js`

**特点**:
- ✅ 单账号签到
- ✅ 基本功能完整

**适用场景**:
- 只有一个账号的用户
- 不需要多账号功能

**状态**: 功能正常，但不推荐（建议升级到 v1.1）

---

### 实验版本

**文件**: `xianjian_signin_v3.js`, `xianjian_signin_v4.js`

**特点**:
- 🔬 实验性功能
- 🔬 不同实现方案

**适用场景**:
- 开发和测试
- 特定场景实验

**状态**: 实验性，不推荐日常使用

---

### 调试版本

**文件**: `xianjian_signin_debug.js`

**特点**:
- 🔍 详细的调试信息
- 🔍 错误追踪

**适用场景**:
- 遇到问题时使用
- 开发和调试

**状态**: 仅用于调试

---

## 📊 版本对比

| 版本 | 多账号 | 智能状态检查 | 日志输出 | 推荐度 |
|------|--------|-------------|---------|--------|
| v1.1 (final) | ✅ 完整支持 | ✅ | ✅ 详细 | ⭐⭐⭐⭐⭐ |
| v1.0 | ❌ 单账号 | ✅ | ⚠️ 基础 | ⭐⭐⭐ |
| v3/v4 | ⚠️ 实验性 | ✅ | ✅ | ⭐⭐ |
| debug | ❌ 单账号 | ✅ | ✅ 超详细 | ⭐ |

---

## 🎯 使用建议

### 对于新用户

1. 阅读 `README.md` 了解项目
2. 查看 `UPDATE_NOTICE.md` 了解最新更新
3. 按照 `MULTI_ACCOUNT_QUICK_START.md` 快速配置
4. 参考 `GET_ACCOUNT_INFO.md` 获取账号信息

### 对于单账号用户

- 使用 `xianjian_signin_final.js`（推荐）
- 配置一个账号即可
- 参考基本配置示例

### 对于多账号用户

- **必须使用** `xianjian_signin_final.js`
- 参考多账号配置示例
- 通过抓包获取所有账号的参数

### 对于遇到问题的用户

1. 查看 `ERROR_FIX_GUIDE.md`
2. 使用 `xianjian_signin_debug.js` 进行调试
3. 检查圈X日志输出
4. 验证配置是否正确

---

## 📝 配置参数说明

### 必需参数

| 参数 | 说明 | 获取方法 | 示例 |
|------|------|---------|------|
| `username` | 账号/手机号 | 用户输入 | "13569284920" |
| `password` | 密码 | 用户输入 | "your_password" |
| `role_id` | 角色ID | 抓包获取 | "1410682267143104932" |
| `role_name` | 角色名 | 游戏内查看 | "剑客小强" |
| `server_id` | 服务器ID | 抓包获取 | "20047" |
| `server_name` | 服务器名 | 游戏内查看 | "Q0047 身世浮沉" |
| `platform` | 平台 | 用户选择 | "android" / "ios" |

### 通用参数（通常固定）

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `page_id` | 页面ID | "8" |
| `game_id` | 游戏ID | "69" |
| `app_id` | 应用ID | "58" |

> 💡 详细获取方法请参考 `GET_ACCOUNT_INFO.md`

---

## 🔧 工具和辅助文件

### config_example.js

**用途**: 配置示例文件

**内容**:
- 完整的账号配置示例
- 多账号配置模板
- Cron时间配置说明
- 圈X配置示例

**使用**: 参考此文件配置你的账号

### xianjian_capture.js

**用途**: 抓包辅助脚本

**功能**: 帮助捕获游戏网络请求

**使用**: 当需要获取账号参数时使用

### test_tool.html

**用途**: 测试工具

**功能**: 在线测试脚本功能

**使用**: 开发和调试时使用

---

## 📚 文档使用指南

### 快速找到所需文档

| 需求 | 推荐文档 |
|------|---------|
| 我是新用户 | README.md → MULTI_ACCOUNT_QUICK_START.md |
| 需要配置多账号 | MULTI_ACCOUNT_QUICK_START.md → GET_ACCOUNT_INFO.md |
| 不知道如何获取账号信息 | GET_ACCOUNT_INFO.md |
| 遇到错误 | ERROR_FIX_GUIDE.md |
| 想了解最新更新 | UPDATE_NOTICE.md |
| 想了解修复细节 | MULTI_ACCOUNT_FIX.md |
| 查看完整更新内容 | UPDATE_SUMMARY_V1.1.md |
| 了解API接口 | INTERFACE_GUIDE.md |
| 参考成功案例 | SUCCESS_GUIDE.md |

### 文档阅读顺序

**对于新用户**:
1. README.md（项目概览）
2. UPDATE_NOTICE.md（了解最新版本）
3. MULTI_ACCOUNT_QUICK_START.md（快速配置）
4. GET_ACCOUNT_INFO.md（获取参数）

**对于多账号用户**:
1. UPDATE_NOTICE.md（了解更新内容）
2. MULTI_ACCOUNT_QUICK_START.md（快速配置）
3. GET_ACCOUNT_INFO.md（获取每个账号的参数）
4. MULTI_ACCOUNT_FIX.md（了解修复细节）

**对于遇到问题的用户**:
1. ERROR_FIX_GUIDE.md（排查错误）
2. xianjian_signin_debug.js（调试）
3. SUCCESS_GUIDE.md（对比正确格式）

---

## 🎓 学习路径

### 初级用户

1. 了解基本概念（README.md）
2. 配置第一个账号（MULTI_ACCOUNT_QUICK_START.md）
3. 测试运行（圈X手动运行）
4. 设置定时任务（README.md）

### 中级用户

1. 配置多个账号（MULTI_ACCOUNT_QUICK_START.md）
2. 学习抓包获取参数（GET_ACCOUNT_INFO.md）
3. 自定义签到时间（config_example.js）
4. 理解日志输出（SUCCESS_GUIDE.md）

### 高级用户

1. 研究API接口（INTERFACE_GUIDE.md）
2. 修改和优化脚本
3. 开发自定义功能
4. 参与问题反馈和改进

---

## ⚠️ 重要提醒

### 版本选择

- ✅ **推荐**: 使用 `xianjian_signin_final.js`（v1.1）
- ⚠️ **可用**: 使用 `xianjian_signin.js`（v1.0）仅限单账号
- ❌ **不推荐**: 实验版本（v3/v4）仅用于测试

### 账号安全

- 🔒 不要公开分享包含真实密码的配置
- 🔒 使用私有仓库或服务器
- 🔒 定期更换密码

### 使用风险

- ⚠️ 自动签到可能违反游戏服务条款
- ⚠️ 使用本脚本产生的后果由用户自行承担
- ⚠️ 建议了解游戏规则后再使用

---

## 📞 获取帮助

### 问题排查步骤

1. **查看文档**
   - ERROR_FIX_GUIDE.md
   - MULTI_ACCOUNT_QUICK_START.md

2. **检查日志**
   - 圈X日志输出
   - 确认错误信息

3. **验证配置**
   - 使用配置检查清单
   - 确认所有参数正确

4. **调试版本**
   - 使用 xianjian_signin_debug.js
   - 获取详细的调试信息

### 文档反馈

如果发现文档错误或需要改进：
- 详细说明问题
- 提供截图或日志
- 建议改进方案

---

## 🔄 更新历史

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-03-13 | v1.1 | 修复多账号支持，完善文档 |
| 2026-03-13 | v1.0 | 初始版本，支持单账号签到 |

---

## 🎯 快速开始

如果你还没有开始使用，现在就开始吧！

### 步骤 1: 阅读文档
👉 [README.md](README.md)

### 步骤 2: 快速配置
👉 [MULTI_ACCOUNT_QUICK_START.md](MULTI_ACCOUNT_QUICK_START.md)

### 步骤 3: 获取账号信息
👉 [GET_ACCOUNT_INFO.md](GET_ACCOUNT_INFO.md)

### 步骤 4: 配置圈X
参考 README.md 中的配置说明

### 步骤 5: 测试运行
在圈X中手动运行一次

### 步骤 6: 完成
等待自动签到！

---

## ✨ 总结

**项目特点**:
- 📚 完整的文档支持
- 🔧 多版本脚本选择
- 🎯 清晰的使用指南
- 🔍 详细的问题排查

**核心优势**:
- ✅ 多账号批量签到
- ✅ 智能状态检查
- ✅ 详细日志输出
- ✅ 丰富的文档支持

**推荐方案**:
1. 使用 `xianjian_signin_final.js`
2. 参考 `MULTI_ACCOUNT_QUICK_START.md` 快速配置
3. 使用 `GET_ACCOUNT_INFO.md` 获取账号参数
4. 定期查看 `UPDATE_NOTICE.md` 了解更新

---

**开始你的自动签到之旅吧！** 🚀

---

**文档版本**: v1.1
**最后更新**: 2026-03-13
