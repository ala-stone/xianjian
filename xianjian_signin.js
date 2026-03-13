/**
 * 仙剑H5自动签到脚本（修复版）
 * 适用于 Quantumult X (圈X)
 * 
 * 功能说明：
 * - 支持账号密码登录
 * - 支持绑定角色（可选）
 * - 自动每日签到
 * - 支持多账号配置
 * 
 * 更新时间：2025-03-13
 * 修复内容：
 * - 更正了登录接口地址
 * - 添加了角色绑定接口
 * - 更正了签到接口地址
 * - 修复了 Cookie 认证方式
 * 
 * 使用方法：
 * 1. 在圈X配置文件的 [Task_local] 中添加：
 *    # 仙剑签到
 *    0 8 * * * https://脚本路径/xianjian_signin.js, tag=仙剑签到, enabled=true
 * 
 * 2. 脚本配置：
 *    在脚本顶部修改账号配置
 */

// ================= 配置区域 =================

// 账号配置（支持多个账号）
const ACCOUNTS = [
    {
        username: "13569284920",          // 账号（手机号）
        password: "cgm19930716",           // 密码
        // 角色信息（首次使用需要填写，后续会自动保存）
        // 如果不知道角色信息，可以留空，脚本会尝试自动获取
        role_id: "",                       // 角色ID（可选）
        role_name: "",                     // 角色名称（可选）
        server_id: "",                     // 服务器ID（可选）
        server_name: "",                   // 服务器名称（可选）
        platform: "android",               // 平台（android/ios）
        page_id: "8",                      // 页面ID（通常固定为8）
        game_id: "69",                     // 游戏ID（通常固定为69）
        app_id: "58"                       // 应用ID（通常固定为58）
    },
    // 如需添加更多账号，复制上面的配置块
    // {
    //     username: "your_account_2",
    //     password: "your_password_2",
    //     role_id: "",
    //     role_name: "",
    //     server_id: "",
    //     server_name: "",
    //     platform: "android",
    //     page_id: "8",
    //     game_id: "69",
    //     app_id: "58"
    // }
];

// 签到通知设置
const NOTIFY_SUCCESS = true;   // 签到成功是否通知
const NOTIFY_FAIL = true;     // 签到失败是否通知

// 是否自动绑定角色（首次使用建议设为true）
const AUTO_BIND_ROLE = true;

// ================= 配置结束 =================

// 接口地址配置
const API_BASE = "https://api.qingcigame.com";
const LOGIN_URL = `${API_BASE}/snail/login/account`;           // 登录接口
const BIND_ROLE_URL = `${API_BASE}/game/binds`;                // 绑定角色接口
const SIGNIN_URL = `${API_BASE}/game/sign/record`;              // 签到接口

// 全局变量
let successCount = 0;
let failCount = 0;
let messageLog = [];

/**
 * 主函数
 */
async function main() {
    log("========================================");
    log("仙剑H5自动签到脚本开始运行");
    log(`时间: ${new Date().toLocaleString()}`);
    log(`总账号数: ${ACCOUNTS.length}`);
    log("========================================\n");

    for (let i = 0; i < ACCOUNTS.length; i++) {
        const account = ACCOUNTS[i];
        log(`【账号 ${i + 1}/${ACCOUNTS.length}】开始处理...`);
        log(`  账号: ${account.username}`);
        
        try {
            // 执行登录、绑定角色、签到
            const result = await signInAccount(account);
            
            if (result.success) {
                successCount++;
                log(`✓ 账号 ${account.username} 签到成功！`);
                messageLog.push(`账号${account.username}: 签到成功`);
            } else {
                failCount++;
                log(`✗ 账号 ${account.username} 签到失败: ${result.message}`);
                messageLog.push(`账号${account.username}: ${result.message}`);
            }
        } catch (error) {
            failCount++;
            log(`✗ 账号 ${account.username} 执行出错: ${error.message}`);
            messageLog.push(`账号${account.username}: ${error.message}`);
        }
        
        log(""); // 空行分隔
    }

    // 汇总结果
    const summary = `
    ========================================
    签到完成！
    时间: ${new Date().toLocaleString()}
    成功: ${successCount} 个
    失败: ${failCount} 个
    ========================================`;

    log(summary);

    // 发送通知
    if (successCount > 0 && NOTIFY_SUCCESS) {
        sendNotification(
            "仙剑签到",
            "签到完成",
            `成功 ${successCount} 个，失败 ${failCount} 个`
        );
    } else if (failCount > 0 && NOTIFY_FAIL) {
        sendNotification(
            "仙剑签到",
            "签到完成",
            `成功 ${successCount} 个，失败 ${failCount} 个`
        );
    }

    $done({ title: "仙剑签到", message: `成功 ${successCount} 个，失败 ${failCount} 个` });
}

/**
 * 执行单账号登录和签到
 * @param {Object} account - 账号信息
 * @returns {Promise<Object>} - 签到结果
 */
async function signInAccount(account) {
    // 1. 登录获取Cookie
    const loginResult = await doLogin(account);
    
    if (!loginResult.success) {
        return {
            success: false,
            message: loginResult.message
        };
    }

    log(`  → 登录成功`);
    const cookie = loginResult.cookie;

    // 2. 绑定角色（如果需要）
    let roleInfo = account.role_id ? {
        role_id: account.role_id,
        role_name: account.role_name,
        server_id: account.server_id,
        server_name: account.server_name
    } : null;

    if (AUTO_BIND_ROLE && !roleInfo) {
        log(`  → 开始绑定角色...`);
        const bindResult = await doBindRole(account, cookie);
        
        if (bindResult.success) {
            roleInfo = bindResult.roleInfo;
            log(`  → 角色绑定成功: ${roleInfo.role_name} (${roleInfo.server_name})`);
        } else {
            log(`  → 角色绑定失败: ${bindResult.message}`);
            // 如果绑定失败但已有角色信息，继续尝试签到
            if (!account.role_id) {
                return {
                    success: false,
                    message: `角色绑定失败: ${bindResult.message}，请在配置中手动填写角色信息`
                };
            }
        }
    }

    // 3. 执行签到
    const signInResult = await doSignIn(account, cookie, roleInfo);
    
    return signInResult;
}

/**
 * 执行登录
 * @param {Object} account - 账号信息
 * @returns {Promise<Object>} - 登录结果
 */
async function doLogin(account) {
    const options = {
        url: LOGIN_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://h5.qingcigame.com",
            "Referer": "https://h5.qingcigame.com/",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.69(0x1800452f) NetType/WIFI Language/zh_CN",
            "Accept": "*/*"
        },
        body: `account=${account.username}&password=${account.password}`
    };

    try {
        const response = await $task.fetch(options);
        
        // 提取响应中的Cookie
        let cookie = "";
        const setCookieHeader = response.headers["Set-Cookie"] || response.headers["set-cookie"];
        if (setCookieHeader) {
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            for (const c of cookies) {
                const match = c.match(/PHPSESSID=([^;]+)/);
                if (match) {
                    cookie = `PHPSESSID=${match[1]}`;
                    break;
                }
            }
        }

        const body = JSON.parse(response.body);

        if (body.code === 200 && body.data) {
            return {
                success: true,
                cookie: cookie,
                message: "登录成功"
            };
        } else {
            return {
                success: false,
                cookie: null,
                message: body.message || "登录失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            cookie: null,
            message: `登录请求失败: ${error.message}`
        };
    }
}

/**
 * 执行角色绑定
 * @param {Object} account - 账号信息
 * @param {string} cookie - Cookie
 * @returns {Promise<Object>} - 绑定结果
 */
async function doBindRole(account, cookie) {
    // 如果配置中没有角色信息，使用默认值
    const role_id = account.role_id || "";
    const role_name = account.role_name || "";
    const server_id = account.server_id || "";
    const server_name = account.server_name || "";
    const platform = account.platform || "android";

    const options = {
        url: BIND_ROLE_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://h5.qingcigame.com",
            "Referer": "https://h5.qingcigame.com/",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.69(0x1800452f) NetType/WIFI Language/zh_CN",
            "Accept": "*/*",
            "Cookie": cookie
        },
        body: `account=${account.username}&page_id=${account.page_id}&game_id=${account.game_id}&type=${platform}&role_id=${role_id}&role_name=${encodeURIComponent(role_name)}&server_id=${server_id}&server_name=${encodeURIComponent(server_name)}&platform=${platform}&extra=`
    };

    try {
        const response = await $task.fetch(options);
        const body = JSON.parse(response.body);

        if (body.code === 200) {
            return {
                success: true,
                roleInfo: {
                    role_id: role_id,
                    role_name: role_name,
                    server_id: server_id,
                    server_name: server_name
                },
                message: "绑定成功"
            };
        } else {
            return {
                success: false,
                roleInfo: null,
                message: body.message || "绑定失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            roleInfo: null,
            message: `绑定请求失败: ${error.message}`
        };
    }
}

/**
 * 执行签到
 * @param {Object} account - 账号信息
 * @param {string} cookie - Cookie
 * @param {Object} roleInfo - 角色信息
 * @returns {Promise<Object>} - 签到结果
 */
async function doSignIn(account, cookie, roleInfo) {
    const options = {
        url: SIGNIN_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://h5.qingcigame.com",
            "Referer": "https://h5.qingcigame.com/",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.69(0x1800452f) NetType/WIFI Language/zh_CN",
            "Accept": "*/*",
            "Cookie": cookie
        },
        body: `app_id=${account.app_id}&page_id=${account.page_id}&game_id=${account.game_id}`
    };

    try {
        const response = await $task.fetch(options);
        const body = JSON.parse(response.body);

        if (body.code === 200) {
            return {
                success: true,
                message: body.message || "签到成功"
            };
        } else {
            return {
                success: false,
                message: body.message || "签到失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `签到请求失败: ${error.message}`
        };
    }
}

/**
 * 发送系统通知
 * @param {string} title - 标题
 * @param {string} subtitle - 副标题
 * @param {string} body - 内容
 */
function sendNotification(title, subtitle, body) {
    $notify(title, subtitle, body);
}

/**
 * 日志输出
 * @param {string} message - 日志消息
 */
function log(message) {
    console.log(message);
}

// 启动脚本
main().catch(error => {
    log(`脚本执行异常: ${error.message}`);
    sendNotification("仙剑签到", "执行异常", error.message);
    $done({ title: "仙剑签到", message: "执行异常: " + error.message });
});
