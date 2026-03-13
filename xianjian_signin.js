/**
 * 仙剑H5自动签到脚本
 * 适用于 Quantumult X (圈X)
 * 
 * 功能说明：
 * - 支持账号密码登录
 * - 自动签到
 * - 支持多账号配置
 * - 支持光子服和正式服切换
 * 
 * 使用方法：
 * 1. 在圈X配置文件的 [Task_local] 中添加：
 *    # 仙剑签到
 *    0 8 * * * https://raw.githubusercontent.com/ala-stone/xianjian/refs/heads/main/xianjian_signin.js, tag=仙剑签到, enabled=true
 * 
 * 2. 脚本配置：
 *    在脚本顶部修改账号配置
 */

// ================= 配置区域 =================

// 服务器选择: "photon" = 光子服, "formal" = 正式服
const SERVER_TYPE = "formal";

// 账号配置（支持多个账号）
const ACCOUNTS = [
    {
        username: "your_account_1",  // 请替换为实际账号
        password: "your_password_1",  // 请替换为实际密码
        server: "formal"             // formal=正式服, photon=光子服
    },
    // 如需添加更多账号，复制上面的配置块
    // {
    //     username: "your_account_2",
    //     password: "your_password_2",
    //     server: "photon"
    // }
];

// 签到通知设置
const NOTIFY_SUCCESS = true;   // 签到成功是否通知
const NOTIFY_FAIL = true;     // 签到失败是否通知

// ================= 配置结束 =================

// 接口地址配置
const API_BASE = "https://h5.qingcigame.com";
const LOGIN_URL = `${API_BASE}/api/login`;           // 登录接口
const SIGNIN_URL = `${API_BASE}/api/signin`;         // 签到接口
const INFO_URL = `${API_BASE}/api/user/info`;        // 用户信息接口

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
        
        try {
            // 执行登录和签到
            const result = await signInAccount(account);
            
            if (result.success) {
                successCount++;
                log(`✓ 账号 ${account.username} 签到成功！累计签到: ${result.days} 天`);
                messageLog.push(`账号${account.username}: 签到成功，累计${result.days}天`);
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
    // 1. 登录获取token
    const loginResult = await doLogin(account);
    
    if (!loginResult.success) {
        return {
            success: false,
            message: loginResult.message,
            days: 0
        };
    }

    log(`  → 登录成功，获取token: ${loginResult.token.substring(0, 20)}...`);

    // 2. 执行签到
    const signInResult = await doSignIn(loginResult.token, account.server);
    
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
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        },
        body: JSON.stringify({
            login_type: "password",
            account: account.username,
            password: account.password,
            server: account.server
        })
    };

    try {
        const response = await $task.fetch(options);
        const body = JSON.parse(response.body);

        if (body.success && body.data && body.data.token) {
            return {
                success: true,
                token: body.data.token,
                message: "登录成功"
            };
        } else {
            return {
                success: false,
                token: null,
                message: body.message || "登录失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            token: null,
            message: `登录请求失败: ${error.message}`
        };
    }
}

/**
 * 执行签到
 * @param {string} token - 登录token
 * @param {string} server - 服务器类型
 * @returns {Promise<Object>} - 签到结果
 */
async function doSignIn(token, server) {
    const options = {
        url: SIGNIN_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        },
        body: JSON.stringify({
            server: server
        })
    };

    try {
        const response = await $task.fetch(options);
        const body = JSON.parse(response.body);

        if (body.success) {
            const days = body.data && body.data.consecutive_days ? body.data.consecutive_days : 0;
            return {
                success: true,
                days: days,
                message: body.message || "签到成功"
            };
        } else {
            return {
                success: false,
                days: 0,
                message: body.message || "签到失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            days: 0,
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


