/**
 * 仙剑H5接口捕获辅助脚本
 * 用于 Quantumult X (圈X)
 * 
 * 使用方法：
 * 1. 在圈X配置文件的 [rewrite_local] 中添加：
 *    https://h5.qingcigame.com/package/template/enter57nqi9z9xcn url script-request-body xianjian_capture.js
 * 2. 在 [mitm] 中添加：
 *    hostname = h5.qingcigame.com
 * 3. 用 Safari 打开网页，手动登录和签到
 * 4. 查看圈X日志，复制捕获的请求信息
 */

// 捕获所有请求
if ($request) {
    console.log("========================================");
    console.log("捕获到请求");
    console.log("URL: " + $request.url);
    console.log("Method: " + $request.method);
    console.log("Headers: " + JSON.stringify($request.headers));
    console.log("Body: " + $request.body);
    console.log("========================================");
    
    // 保存到本地存储
    const key = "xianjian_captured_request";
    $prefs.setValueForKey(JSON.stringify({
        url: $request.url,
        method: $request.method,
        headers: $request.headers,
        body: $request.body
    }, null, 2), key);
    
    console.log("已保存到本地存储: " + key);
    
    // 发送通知
    $notify("仙剑H5", "已捕获请求", "请查看日志");
}

$done();
