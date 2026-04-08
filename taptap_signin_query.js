// ==================================================
// TapTap 签到状态查询脚本 v1.0
// 适配平台: Quantumult X (圈X)
// 脚本类型: task (定时任务)
//
// 【功能】
//   1. 查询奖励列表（全部10档签到奖励及库存）
//   2. 查询已领取的奖励（含兑换码）
//
// 【依赖】
//   需先安装 taptap_cookie.js 重写插件，触发一次 Cookie 抓取。
//
// 【圈X 定时任务配置（示例）】
//   [task_local]
//   ; 每天早上 9:00 查询签到状态
//   0 9 * * * taptap_signin_query.js, tag=TapTap签到查询, img-url=https://www.taptap.cn/favicon.ico, enabled=true
// ==================================================

(function () {

  // ── 1. 读取认证数据 ──
  const rawCookie  = $prefs.valueForKey("taptap_cookie")      || "";
  const xsrfToken  = $prefs.valueForKey("taptap_xsrf")        || "";
  const userId     = $prefs.valueForKey("taptap_user_id")     || "";
  const smfp       = $prefs.valueForKey("taptap_smfp")        || "";
  const uuid       = $prefs.valueForKey("taptap_uuid")        || "";
  const clientXua  = $prefs.valueForKey("taptap_client_xua")  || "";
  const activityId = $prefs.valueForKey("taptap_activity_id") || "wxmxb2il";

  if (!rawCookie || !xsrfToken) {
    $notify("TapTap 查询失败", "缺少认证信息", "请先用浏览器打开 TapTap 签到页触发 Cookie 抓取。");
    $done();
    return;
  }

  // ── 基础请求头（GET 请求）──
  const baseHeaders = {
    "Host":             "www.taptap.cn",
    "Accept":           "application/json, text/plain, */*",
    "x-requested-with": "XMLHttpRequest",
    "X-XSRF-TOKEN":     xsrfToken,
    "Sec-Fetch-Site":   "same-origin",
    "Sec-Fetch-Mode":   "cors",
    "Sec-Fetch-Dest":   "empty",
    "Origin":           "https://www.taptap.cn",
    "Referer":          "https://www.taptap.cn/events/game-sign/" + activityId,
    "User-Agent":       "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Accept-Language":  "zh-CN,zh-Hans;q=0.9",
    "Cookie":           rawCookie,
  };

  if (smfp)      baseHeaders["x-smfp"]       = smfp;
  if (clientXua) baseHeaders["X-CLIENT-XUA"] = clientXua;

  // ── 查询函数 ──
  function fetchJSON(url, headers) {
    return $task.fetch({
      url:     url,
        method:  "GET",
        headers: headers,
    });
  }

  // ── 构造两个接口的 URL ──
  const encodedUuid   = encodeURIComponent(uuid);
  const encodedUserId = encodeURIComponent(userId);

  // 接口1: 奖励列表（detail）
  const detailUrl =
    "https://www.taptap.cn/webapiv2/event/game-sign/detail/" + activityId
    + "?X-UA=V%3D1%26PN%3DWebActivity%26LANG%3Dzh_CN%26LOC%3DCN%26PLT%3DiOS"
    + "%26UID%3D" + encodedUuid + "%26VN_CODE%3D3%26VID%3D" + encodedUserId;

  // 接口2: 已领取列表（my-award-list）
  const awardListUrl =
    "https://www.taptap.cn/webapiv2/event/game-sign/v2/my-award-list/" + activityId
    + "?X-UA=V%3D1%26PN%3DWebActivity%26LANG%3Dzh_CN%26LOC%3DCN%26PLT%3DiOS"
    + "%26UID%3D" + encodedUuid + "%26VN_CODE%3D3%26VID%3D" + encodedUserId;

  // ── 第一步：查询奖励列表 ──
  console.log("[TapTap查询] 查询奖励列表...");
  fetchJSON(detailUrl, baseHeaders).then(
    function (resp) {
      let body;
      try { body = JSON.parse(resp.body); } catch (e) { body = {}; }

      let rewardLines = [];
      const awards = body.data && body.data.award_pool && body.data.award_pool.award_list;
      if (awards && awards.length > 0) {
        awards.forEach(function (item) {
          const day     = item.accept_threshold;
          const content = item.content;
          const inv    = (item.group && item.group.prize_list && item.group.prize_list[0])
                         ? item.group.prize_list[0].inventory
                         : "?";
          const total   = (item.group && item.group.prize_list && item.group.prize_list[0])
                         ? item.group.prize_list[0].total
                         : "?";
          rewardLines.push("第" + day + "天  " + content + "  剩余 " + inv + "/" + total);
        });
      } else {
        rewardLines.push("(无奖励数据)");
      }

      // ── 第二步：查询已领取列表 ──
      console.log("[TapTap查询] 查询已领取列表...");
      fetchJSON(awardListUrl, baseHeaders).then(
        function (resp2) {
          let body2;
          try { body2 = JSON.parse(resp2.body); } catch (e) { body2 = {}; }

          let claimLines = [];
          const myAwards = body2.data && body2.data.award_list;
          if (myAwards && myAwards.length > 0) {
            myAwards.forEach(function (item) {
              const title = item.prize && item.prize.title ? item.prize.title : "(未知)";
              const code  = item.code  ? item.code  : "(无码)";
              const ts    = item.time  ? new Date(item.time * 1000).toLocaleString("zh-CN") : "?";
              claimLines.push(title + "  码: " + code + "  领: " + ts);
              console.log("[TapTap查询] 兑换码: " + title + " → " + code + " (领于 " + ts + ")");
            });
          } else {
            claimLines.push("(暂无已领取奖励)");
            console.log("[TapTap查询] (暂无已领取奖励)");
          }

          // ── 组装通知 ──
          const titleText = "TapTap 签到状态  user=" + userId;
          const rewardSummary = "奖励共" + (awards ? awards.length : 0) + "档 | 已领" + (myAwards ? myAwards.length : 0) + "档";
          const detailText = rewardLines.join("\n") + "\n\n--- 已领取 ---\n" + claimLines.join("\n");

          $notify(titleText, rewardSummary, detailText);
          console.log("[TapTap查询] 完成 已领 " + (myAwards ? myAwards.length : 0) + " 档");
          $done();

        },
        function (err2) {
          $notify("TapTap 查询失败", "已领取列表请求失败", err2.error || "网络错误");
          console.log("[TapTap查询] 已领取列表请求失败: " + err2.error);
          $done();
        }
      );

    },
    function (err) {
      $notify("TapTap 查询失败", "奖励列表请求失败", err.error || "网络错误");
      console.log("[TapTap查询] 奖励列表请求失败: " + err.error);
      $done();
    }
  );

})();
