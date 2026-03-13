/**
 * 仙剑H5自动签到脚本 - 调试版本
 * 用于详细分析接口调用过程
 */

// ================= 配置区域 =================

// 账号配置
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
    }
];

// 调试模式
const DEBUG_MODE = true;

// ================= 配置结束 =================

// 接口地址配置
const API_BASE = "https://api.qingcigame.com";
const LOGIN_URL = `${API_BASE}/snail/login/account`;
const BIND_ROLE_URL = `${API_BASE}/game/binds`;
const SIGNIN_URL = `${API_BASE}/game/sign/record`;

/**
 * 主函数
 */
async function main() {
    log("========================================");
    log("仙剑H5自动签到脚本 - 调试模式");
    log(`时间: ${new Date().toLocaleString()}`);
    log("========================================\n");

    const account = ACCOUNTS[0];
    log(`【账号】${account.username}`);
    log("");

    try {
        // 1. 登录
        log("【步骤1】开始登录...");
        const loginResult = await doLogin(account);
        log("");
        
        if (!loginResult.success) {
            log("✗ 登录失败：" + loginResult.message);
            return;
        }
        
        log(`✓ 登录成功`);
        log(`  Cookie: ${loginResult.cookie}`);
        log("");

        // 2. 绑定角色
        log("【步骤2】开始绑定角色...");
        const bindResult = await doBindRole(account, loginResult.cookie);
        log("");
        
        if (!bindResult.success) {
            log("✗ 角色绑定失败：" + bindResult.message);
        } else {
            log(`✓ 角色绑定成功`);
        }
        log("");

        // 3. 签到（测试不同的参数组合）
        log("【步骤3】测试签到接口...");
        log("");
        
        // 测试1：基础参数
        log("【测试1】基础参数（app_id, page_id, game_id）");
        const test1 = await testSignIn(account, loginResult.cookie, {
            app_id: account.app_id,
            page_id: account.page_id,
            game_id: account.game_id
        });
        log("");

        // 测试2：添加 role_id
        log("【测试2】添加 role_id");
        const test2 = await testSignIn(account, loginResult.cookie, {
            app_id: account.app_id,
            page_id: account.page_id,
            game_id: account.game_id,
            role_id: account.role_id
        });
        log("");

        // 测试3：添加所有角色信息
        log("【测试3】添加所有角色信息");
        const test3 = await testSignIn(account, loginResult.cookie, {
            app_id: account.app_id,
            page_id: account.page_id,
            game_id: account.game_id,
            role_id: account.role_id,
            role_name: account.role_name,
            server_id: account.server_id,
            server_name: account.server_name
        });
        log("");

        log("========================================");
        log("测试完成！");
        log("========================================");

        // 发送通知
        $notify("仙剑签到调试", "测试完成", `请查看日志`);

    } catch (error) {
        log(`✗ 执行出错: ${error.message}`);
        $notify("仙剑签到调试", "执行出错", error.message);
    }

    $done();
}

/**
 * 测试签到接口
 */
async function testSignIn(account, cookie, params) {
    // 构建请求体
    const bodyParts = [];
    for (const [key, value] of Object.entries(params)) {
        bodyParts.push(`${key}=${encodeURIComponent(value)}`);
    }
    const body = bodyParts.join('&');
    
    // 构建URL参数（用于GET请求）
    const urlParams = '?' + body;
    
    log(`  请求URL: ${SIGNIN_URL}`);
    log(`  请求Body: ${body}`);
    log(`  URL参数: ${urlParams}`);

    // 测试 POST 方法
    log(`\n  【测试 POST 方法】`);
    const postResult = await doRequest(SIGNIN_URL, 'POST', cookie, body);

    // 测试 GET 方法
    log(`\n  【测试 GET 方法】`);
    const getUrl = SIGNIN_URL + urlParams;
    const getResult = await doRequest(getUrl, 'GET', cookie, '');

    // 返回成功的结果
    if (postResult.success) {
        return postResult;
    } else if (getResult.success) {
        return getResult;
    } else {
        return { success: false, message: 'POST和GET都失败了' };
    }
}

/**
 * 执行HTTP请求
 */
async function doRequest(url, method, cookie, body) {
    log(`    ${method} 请求URL: ${url}`);
    if (body) {
        log(`    ${method} 请求Body: ${body}`);
    }

    const options = {
        url: url,
        method: method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://h5.qingcigame.com",
            "Referer": "https://h5.qingcigame.com/",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.69(0x1800452f) NetType/WIFI Language/zh_CN",
            "Accept": "*/*",
            "Cookie": cookie
        }
    };

    // 只在POST请求时添加body
    if (method === 'POST' && body) {
        options.body = body;
    }

    try {
        const response = await $task.fetch(options);
        
        log(`    响应状态: ${response.statusCode}`);
        log(`    响应Body: ${response.body}`);
        
        const responseBody = JSON.parse(response.body);
        
        if (responseBody.code === 200) {
            log(`    ✓ ${method} 签到成功: ${responseBody.message}`);
            return { success: true, message: responseBody.message, method: method };
        } else {
            log(`    ✗ ${method} 签到失败: ${responseBody.message}`);
            return { success: false, message: responseBody.message, method: method };
        }
    } catch (error) {
        log(`    ✗ ${method} 请求失败: ${error.message}`);
        return { success: false, message: error.message, method: method };
    }
}

/**
 * 执行登录
 */
async function doLogin(account) {
    const body = `account=${account.username}&password=${account.password}`;
    
    log(`  请求URL: ${LOGIN_URL}`);
    log(`  请求Body: ${body}`);

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
        body: body
    };

    try {
        const response = await $task.fetch(options);
        
        log(`  响应状态: ${response.statusCode}`);
        log(`  响应Body: ${response.body}`);

        // 提取Cookie
        let cookie = "";
        const setCookieHeader = response.headers["Set-Cookie"] || response.headers["set-cookie"];
        if (setCookieHeader) {
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            for (const c of cookies) {
                const match = c.match(/PHPSESSID=([^;]+)/);
                if (match) {
                    cookie = `PHPSESSID=${match[1]}`;
                    log(`  提取Cookie: ${cookie}`);
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
        log(`  请求失败: ${error.message}`);
        return {
            success: false,
            cookie: null,
            message: `登录请求失败: ${error.message}`
        };
    }
}

/**
 * 执行角色绑定
 */
async function doBindRole(account, cookie) {
    const body = `account=${account.username}&page_id=${account.page_id}&game_id=${account.game_id}&type=${account.platform}&role_id=${account.role_id}&role_name=${encodeURIComponent(account.role_name)}&server_id=${account.server_id}&server_name=${encodeURIComponent(account.server_name)}&platform=${account.platform}&extra=`;
    
    log(`  请求URL: ${BIND_ROLE_URL}`);
    log(`  请求Body: ${body}`);

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
        body: body
    };

    try {
        const response = await $task.fetch(options);
        
        log(`  响应状态: ${response.statusCode}`);
        log(`  响应Body: ${response.body}`);

        const body = JSON.parse(response.body);

        if (body.code === 200) {
            return {
                success: true,
                roleInfo: account,
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
        log(`  请求失败: ${error.message}`);
        return {
            success: false,
            roleInfo: null,
            message: `绑定请求失败: ${error.message}`
        };
    }
}

/**
 * 日志输出
 */
function log(message) {
    console.log(message);
}

// 启动脚本
main().catch(error => {
    log(`脚本执行异常: ${error.message}`);
    $done();
});
