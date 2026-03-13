/**
 * 仙剑H5自动签到脚本 - V4版本
 * 完整模拟浏览器session流程
 */

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

const API_BASE = "https://api.qingcigame.com";
const LOGIN_URL = `${API_BASE}/snail/login/account`;
const SIGN_LIST_URL = `${API_BASE}/game/sign/list`;
const BIND_ROLE_URL = `${API_BASE}/game/binds`;
const SIGNIN_URL = `${API_BASE}/game/sign/record`;

let successCount = 0;
let failCount = 0;

async function main() {
    log("========================================");
    log("仙剑H5自动签到脚本 - V4版本");
    log(`时间: ${new Date().toLocaleString()}`);
    log("========================================\n");

    const account = ACCOUNTS[0];
    log(`【账号】${account.username}`);
    log("");

    try {
        // 1. 登录
        log("【步骤1】登录...");
        const loginResult = await doLogin(account);
        if (!loginResult.success) {
            throw new Error(loginResult.message);
        }
        let cookie = loginResult.cookie;
        log(`✓ 登录成功`);
        log("");

        // 2. 第一次获取签到列表
        log("【步骤2】获取签到列表（绑定前）...");
        await getSignList(account, cookie);
        log("");

        // 3. 绑定角色
        log("【步骤3】绑定角色...");
        const bindResult = await doBindRole(account, cookie);
        if (bindResult.success) {
            log(`✓ 角色绑定成功`);
            // 更新cookie（可能有新cookie）
            if (bindResult.newCookie) {
                cookie = bindResult.newCookie;
                log(`  → Cookie已更新`);
            }
        } else {
            log(`✗ 角色绑定失败: ${bindResult.message}`);
        }
        log("");

        // 4. 第二次获取签到列表
        log("【步骤4】获取签到列表（绑定后）...");
        const listResult = await getSignList(account, cookie);
        log("");

        // 5. 签到
        log("【步骤5】执行签到...");
        const signInResult = await doSignIn(account, cookie);
        log("");

        if (signInResult.success) {
            log(`✓ 签到成功: ${signInResult.message}`);
            successCount++;
        } else {
            log(`✗ 签到失败: ${signInResult.message}`);
            failCount++;
        }

    } catch (error) {
        log(`✗ 执行出错: ${error.message}`);
        failCount++;
    }

    const summary = `
    ========================================
    签到完成！
    时间: ${new Date().toLocaleString()}
    成功: ${successCount} 个
    失败: ${failCount} 个
    ========================================`;

    log(summary);

    if (successCount > 0 || failCount > 0) {
        $notify("仙剑签到", "签到完成", `成功 ${successCount} 个，失败 ${failCount} 个`);
    }

    $done({ title: "仙剑签到", message: `成功 ${successCount} 个，失败 ${failCount} 个` });
}

async function getSignList(account, cookie) {
    let url = `${SIGN_LIST_URL}?app_id=${account.app_id}&game_id=${account.game_id}`;
    if (account.role_id) {
        url += `&role_id=${account.role_id}`;
    }
    
    const options = {
        url: url,
        method: "GET",
        headers: {
            "Origin": "https://h5.qingcigame.com",
            "Referer": "https://h5.qingcigame.com/",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.69(0x1800452f) NetType/WIFI Language/zh_CN",
            "Accept": "*/*",
            "Cookie": cookie
        }
    };

    try {
        const response = await $task.fetch(options);
        const body = JSON.parse(response.body);
        
        if (body.code === 200) {
            log(`  ✓ 获取成功`);
            log(`  → 累计签到: ${body.data?.sign_total || 0} 天`);
            log(`  → 今日已签到: ${body.data?.is_get ? '是' : '否'}`);
            return { success: true, data: body.data };
        } else {
            log(`  ✗ 获取失败: ${body.message}`);
            return { success: false, message: body.message };
        }
    } catch (error) {
        log(`  ✗ 请求失败: ${error.message}`);
        return { success: false, message: error.message };
    }
}

async function doLogin(account) {
    const body = `account=${account.username}&password=${account.password}`;
    
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
                user_id: body.data.user_id || null,
                message: "登录成功"
            };
        } else {
            return {
                success: false,
                cookie: null,
                user_id: null,
                message: body.message || "登录失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            cookie: null,
            user_id: null,
            message: `登录请求失败: ${error.message}`
        };
    }
}

async function doBindRole(account, cookie) {
    const body = `account=${account.username}&page_id=${account.page_id}&game_id=${account.game_id}&type=${account.platform}&role_id=${account.role_id}&role_name=${encodeURIComponent(account.role_name)}&server_id=${account.server_id}&server_name=${encodeURIComponent(account.server_name)}&platform=${account.platform}&extra=`;

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
        
        // 检查是否有新的cookie
        let newCookie = null;
        const setCookieHeader = response.headers["Set-Cookie"] || response.headers["set-cookie"];
        if (setCookieHeader) {
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            for (const c of cookies) {
                const match = c.match(/PHPSESSID=([^;]+)/);
                if (match) {
                    newCookie = `PHPSESSID=${match[1]}`;
                    break;
                }
            }
        }

        const body = JSON.parse(response.body);

        if (body.code === 200) {
            return {
                success: true,
                newCookie: newCookie,
                roleInfo: account,
                message: "绑定成功"
            };
        } else {
            return {
                success: false,
                newCookie: null,
                roleInfo: null,
                message: body.message || "绑定失败"
            };
        }
    } catch (error) {
        return {
            success: false,
            newCookie: null,
            roleInfo: null,
            message: `绑定请求失败: ${error.message}`
        };
    }
}

async function doSignIn(account, cookie) {
    const body = `app_id=${account.app_id}&page_id=${account.page_id}&game_id=${account.game_id}`;
    
    log(`  Body: ${body}`);
    log(`  Cookie: ${cookie}`);
    
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
        body: body
    };

    try {
        const response = await $task.fetch(options);
        log(`  状态: ${response.statusCode}`);
        log(`  响应: ${response.body}`);
        
        const responseBody = JSON.parse(response.body);

        if (responseBody.code === 200) {
            return { success: true, message: responseBody.message };
        } else {
            return { success: false, message: responseBody.message };
        }
    } catch (error) {
        log(`  请求失败: ${error.message}`);
        return { success: false, message: error.message };
    }
}

function log(message) {
    console.log(message);
}

main().catch(error => {
    log(`脚本执行异常: ${error.message}`);
    $done({ title: "仙剑签到", message: "执行异常: " + error.message });
});
