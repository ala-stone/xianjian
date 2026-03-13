/**
 * 仙剑H5自动签到脚本 - 最终版本
 * 智能判断签到状态
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
    },
    {
        username: "18610509630",
        password: "cgm19930717",
        role_id: "1410682267143104933",
        role_name: "Capybara",
        server_id: "20048",
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
let skipCount = 0;

async function main() {
    log("========================================");
    log("仙剑H5自动签到脚本 - 最终版本");
    log(`时间: ${new Date().toLocaleString()}`);
    log(`账号数量: ${ACCOUNTS.length}`);
    log("========================================\n");

    // 遍历所有账号
    for (let i = 0; i < ACCOUNTS.length; i++) {
        const account = ACCOUNTS[i];
        log(`【账号 ${i + 1}/${ACCOUNTS.length}】${account.username}`);
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

            // 2. 绑定角色
            log("【步骤2】绑定角色...");
            const bindResult = await doBindRole(account, cookie);
            if (bindResult.success) {
                log(`✓ 角色绑定成功`);
                if (bindResult.newCookie) {
                    cookie = bindResult.newCookie;
                    log(`  → Cookie已更新`);
                }
            } else {
                log(`  → 角色绑定: ${bindResult.message}`);
            }
            log("");

            // 3. 检查签到状态
            log("【步骤3】检查签到状态...");
            const listResult = await getSignList(account, cookie);
            log("");

            // 4. 根据状态决定是否签到
            if (listResult.success && listResult.isSignedToday) {
                log(`✓ 今日已签到，跳过签到`);
                skipCount++;
                log(`  → 累计签到: ${listResult.signTotal} 天`);
            } else if (listResult.success && !listResult.isSignedToday) {
                log(`→ 今日未签到，开始签到...`);
                log(`  → 当前累计: ${listResult.signTotal} 天`);
                log("");

                // 5. 执行签到
                log("【步骤4】执行签到...");
                const signInResult = await doSignIn(account, cookie);
                log("");

                if (signInResult.success) {
                    log(`✓ 签到成功: ${signInResult.message}`);
                    successCount++;
                } else {
                    log(`✗ 签到失败: ${signInResult.message}`);
                    failCount++;
                }
            } else {
                log(`✗ 无法获取签到状态: ${listResult.message}`);
                failCount++;
            }

        } catch (error) {
            log(`✗ 执行出错: ${error.message}`);
            failCount++;
        }

        // 账号之间添加分隔符（最后一个账号除外）
        if (i < ACCOUNTS.length - 1) {
            log("\n" + "-".repeat(40) + "\n");
        }
    }

    const summary = `
    ========================================
    签到完成！
    时间: ${new Date().toLocaleString()}
    成功: ${successCount} 个
    失败: ${failCount} 个
    跳过: ${skipCount} 个（今日已签到）
    ========================================`;

    log(summary);

    if (successCount > 0 || failCount > 0 || skipCount > 0) {
        $notify("仙剑签到", "签到完成", `成功${successCount} 失败${failCount} 跳过${skipCount}`);
    }

    $done({ title: "仙剑签到", message: `成功${successCount} 失败${failCount} 跳过${skipCount}` });
}

async function getSignList(account, cookie) {
    let url = `${SIGN_LIST_URL}?app_id=${account.app_id}&game_id=${account.game_id}`;
    if (account.role_id) {
        url += `&role_id=${account.role_id}`;
    }
    
    log(`  URL: ${url}`);
    
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
        
        if (body.code === 200 && body.data) {
            log(`  ✓ 获取签到状态成功`);
            log(`  → 累计签到: ${body.data.sign_total || 0} 天`);
            log(`  → 今日已签到: ${body.data.is_get ? '是' : '否'}`);
            
            return {
                success: true,
                isSignedToday: body.data.is_get === true || body.data.is_get === "1",
                signTotal: body.data.sign_total || 0,
                message: "获取成功"
            };
        } else {
            log(`  ✗ 获取失败: ${body.message}`);
            return {
                success: false,
                isSignedToday: false,
                signTotal: 0,
                message: body.message || "获取失败"
            };
        }
    } catch (error) {
        log(`  ✗ 请求失败: ${error.message}`);
        return {
            success: false,
            isSignedToday: false,
            signTotal: 0,
            message: error.message
        };
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

        const responseBody = JSON.parse(response.body);

        if (responseBody.code === 200 && responseBody.data) {
            return {
                success: true,
                cookie: cookie,
                user_id: responseBody.data.user_id || null,
                message: "登录成功"
            };
        } else {
            return {
                success: false,
                cookie: null,
                user_id: null,
                message: responseBody.message || "登录失败"
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

        const responseBody = JSON.parse(response.body);

        if (responseBody.code === 200) {
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
                message: responseBody.message || "绑定失败"
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

