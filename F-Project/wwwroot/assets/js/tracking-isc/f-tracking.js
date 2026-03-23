
// ========================= SNOWPLOW INIT =========================
(function (p, l, o, w, i, n, g) {
	if (!p[i]) {
		p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
		p.GlobalSnowplowNamespace.push(i);

		// Hàm queue tạm để đẩy lệnh Snowplow khi script chưa load xong
		p[i] = function () {
			(p[i].q = p[i].q || []).push(arguments);
		};

		p[i].q = p[i].q || [];

		n = l.createElement(o);
		g = l.getElementsByTagName(o)[0];
		n.async = 1;
		n.src = w;
		g.parentNode.insertBefore(n, g);
	}
})(window, document, "script", "https://fpt.vn/assets/js/tracking-isc/sp-isc.js", "snowplowIsc");

// 1. Khởi tạo Tracker Snowplow
window.snowplowIsc("newTracker", "sp1", "https://ftracking.fpt.vn", {
	appId: "600",
	platform: "web",
	post: true,
    encodeBase64: true,
    // eventMethod: "beacon",
    // forcePlatformContext: true,
});

// 2. Bật heartbeat để đo thời gian active
window.snowplowIsc("enableActivityTracking", {
	minimumVisitLength: 5,
	heartbeatDelay: 10
});

// 3. Gửi page_view mặc định của Snowplow (pv)
window.snowplowIsc('trackPageView');

// 4. add plugin
const plugins = [
	{
		url: 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-button-click-tracking@4.6.8/dist/index.umd.min.js',
		args: ['snowplowButtonClickTracking', 'ButtonClickTrackingPlugin']
	},
	{
		url: 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-link-click-tracking@4.6.8/dist/index.umd.min.js',
		args: ['snowplowLinkClickTracking', 'LinkClickTrackingPlugin']
	},
	// {
	// 	url: 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@4.6.8/dist/index.umd.min.js',
	// 	args: ['snowplowFormTracking', 'FormTrackingPlugin']
	// }
];

plugins.forEach(p => {
	window.snowplowIsc('addPlugin', p.url, p.args);
});

// 5. enable plugin
window.snowplowIsc('enableLinkClickTracking', {
	trackContent: true,
	options: {
		'allowlist': ['tracked']
	}
});
window.snowplowIsc('enableButtonClickTracking', {
	filter: {
		allowlist: ['tracked'],
	}
});
// window.snowplowIsc('enableFormTracking');

// ========================= PAGE VIEW SNOWPLOW =========================

// executeTrackingIsc();

// ========================= LIST FUNCTIONAL =========================
// 01. ftk_uuidv4: Tạo UUID v4 ngẫu nhiên làm base cho các ID hệ thống.
// 02. ftk_getEventIdIsc: Sinh event_id tạm thời, không lưu localStorage.
// 03. ftk_generateEventIdIsc: Sinh event_id mới và lưu vào localStorage (sp_event_id).
// 04. ftk_getDomainUserIdIsc: Tạo và lưu sp_domain_userid persistent trong localStorage.
// 05. ftk_getDeviceId: Lấy device_id persistent từ localStorage.
// 06. ftk_generateDeviceId: Sinh device_id từ timestamp + random + userAgent.
// 07. ftk_maskPhone: Che số điện thoại (3 số đầu + **** + 3 số cuối).
// 08. ftk_getFormattedTimestamp: Trả về timestamp hiện tại dạng ISO.
// 09. ftk_formatDateTime: Convert Date sang ISO string.
// 10. ftk_detectDeviceTypeIsc: Xác định loại thiết bị (PC/Mobile/Tablet).
// 11. ftk_detectOSIsc: Xác định hệ điều hành từ userAgent.
// 12. ftk_getSessionStartTime: Lấy hoặc tạo session_start trong sessionStorage.
// 13. ftk_getSessionDurationInSeconds: Tính thời gian user ở trang (giây).
// 14. ftk_getScrollPercentage: Tính % scroll hiện tại (0–100).
// 15. ftk_getUserId: Lấy user_id từ DOM (.profile-idd), nếu không có trả về "Unknown".
// 16. ftk_getLocationName: Lấy location/district/ward từ localStorage và ghép chuỗi.
// 17. ftk_getCookie: Đọc cookie theo tên.
// 18. ftk_extractText: Lấy label cho click event (ưu tiên data-sp-label, alt, textContent).
// 19. ftk_getAffiliateInfo: Lấy affiliate trackingId (aff_sid) từ cookie.


// ========================= UUID GENERATOR =========================

/**
 * Tạo UUID v4 ngẫu nhiên để dùng cho event_id, domain_userid...
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
function ftk_uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

/**
 * Tạo event_id mới mỗi lần dùng (không lưu localStorage)
 * Dùng khi bạn muốn ID “tạm thời” từng event.
 */
function ftk_getEventIdIsc() {
	return ftk_uuidv4();
}

/**
 * Tạo event_id mới mỗi event và LUÔN lưu vào localStorage.
 * => localStorage.sp_event_id = event id cuối cùng đã gửi.
 * Dùng để đối soát hoặc debug event cuối cùng.
 */
function ftk_generateEventIdIsc() {
	const newId = ftk_uuidv4();
	localStorage.setItem("sp_event_id", newId);
	return newId;
}

/**
 * Domain User ID cố định (persistent). Tạo 1 lần và lưu localStorage.
 * Không liên quan tới Snowplow domain_userid.
 * Dùng làm ID bền vững cho user trong hệ thống FPT.
 */
function ftk_getDomainUserIdIsc() {
	const KEY = "sp_domain_userid";
	let id = localStorage.getItem(KEY);

	if (!id) {
		id = ftk_uuidv4();
		localStorage.setItem(KEY, id);
	}
	return id;
}

/**
 * 
 * @param {*} phone 
 * @returns 
 */
function ftk_maskPhone(phone) {
	if (!phone) return null;
	return phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
}

// ========================= FORMAT TIME =========================

/**
 * Format timestamp dạng dd/mm/yyyy hh:mm:ss
 * Dùng cho trường thời gian trong payload custom event
 */
function ftk_getFormattedTimestamp() {
    // Lấy thời gian hiện tại
    const d = new Date();

    // Hàm helper: ép số về dạng chuỗi 2 ký tự (ví dụ: 3 → "03")
    const pad = (n) => String(n).padStart(2, '0');

    // Lấy ngày, tháng (0-based nên +1), năm
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();

    // Lấy giờ, phút, giây
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    // Ghép chuỗi thành format dd/mm/yyyy hh:mm:ss
    // return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
	return new Date().toISOString();
}

// ========================= DEVICE & OS DETECTION =========================

/**
 * Xác định loại thiết bị: PC / Mobile / Tablet
 */
function ftk_detectDeviceTypeIsc() {
	const ua = navigator.userAgent;
	if (/Tablet|iPad/i.test(ua)) return "Tablet";
	if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
	return "PC";
}

/**
 * Xác định hệ điều hành: Windows/macOS/iOS/Android/Linux...
 */
function ftk_detectOSIsc() {
	const ua = navigator.userAgent || navigator.vendor || window.opera;

	if (/windows phone/i.test(ua)) return "Windows Phone";
	if (/android/i.test(ua)) return "Android";
	if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
	if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
	if (/Windows NT/i.test(ua)) return "Windows";
	if (/Linux/i.test(ua)) return "Linux";

	return "Unknown OS";
}

// ========================= EXECUTE TRACKING PAGE LOAD =========================

/**
 * Xác định page context và gửi event load page custom
 */
function executeTrackingIsc() {
	const path = window.location.pathname;
	const screen_location = $("title").text();
	trackingEventIsc("page_view", screen_location);
}

// ========================= LABEL EXTRACTOR =========================

/**
 * Lấy text để gán label cho click event:
 * - Ưu tiên data-sp-label
 * - Nếu IMG -> dùng alt
 * - Ngược lại dùng innerText
 */
function ftk_extractText(el) {
	if (!el) return "";

	const label = el.getAttribute("data-sp-label");
	if (label) return label;

	if (el.tagName === "IMG") return el.getAttribute("alt") || "";

	return el.textContent.trim();
}

// ========================= DEVICE ID =========================
/**
 * Tạo device_id cố định (persistent)
 * Format: timestamp + random + userAgent hash
 */
function ftk_getDeviceId() {
	const key = "sp_device_id";
	let id = localStorage.getItem(key);

	if (!id) {
		id = ftk_generateDeviceId();
		localStorage.setItem(key, id);
	}
	return id;
}

/**
 * Sinh mã định danh thiết bị (device_id)
 */
function ftk_generateDeviceId() {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).substring(2, 10);
	const ua = navigator.userAgent.slice(0, 10).replace(/\W/g, "");

	return `${timestamp}-${random}-${ua}`;
}

// ========================= LOCATION DETECT =========================

/**
 * Ghép location + district + ward từ localStorage
 */
function ftk_getLocationName() {
	const location = localStorage.getItem("locationname") || "";
	const district = localStorage.getItem("districtname") || "";
	const ward = localStorage.getItem("wardname") || "";

	if (!location) return null;

	return `${location} | ${district} | ${ward}`;
}

// ========================= COOKIE READER =========================

/**
 * Đọc cookie theo tên
 */
function ftk_getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// ========================= DATETIME & SESSION =========================

/**
 * Format datetime theo mm/dd/yyyy hh:mm:ss
 */
function ftk_formatDateTime(input) {
	
    // Nếu input là Date thì dùng trực tiếp, nếu không thì convert sang Date
    const date = (input instanceof Date) ? input : new Date(input);

    // Hàm helper: ép số về chuỗi 2 ký tự
    const pad = (n) => String(n).padStart(2, "0");

    // Lấy các thành phần của datetime
    const month   = pad(date.getMonth() + 1); // month 0–11 → +1
    const day     = pad(date.getDate());
    const year    = date.getFullYear();

    const hours   = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Trả về format mm/dd/yyyy hh:mm:ss
    // return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
	return date.toISOString();
}

/**
 * Lấy thời điểm bắt đầu session (tồn tại trong sessionStorage)
 */
function ftk_getSessionStartTime() {
	const key = "session_start";
	const stored = sessionStorage.getItem(key);

	// Nếu chưa có → tạo mới
	if (stored) {
		return new Date(stored);
	}

	// Nếu đã tồn tại → convert từ string thành Date
	const now = new Date();
	sessionStorage.setItem(key, now.toISOString());
	return now;
}

/**
 * Tính thời gian user đã ở trong trang (giây)
 */
function ftk_getSessionDurationInSeconds() {
	const start = sessionStorage.getItem("session_start");
	if (!start) return 0;

	const startDate = new Date(start);

	// Nếu ngày parse lỗi → reset
	if (isNaN(startDate.getTime())) {
		sessionStorage.removeItem("session_start");
		return 0;
	}

	const now = new Date();
	return Math.floor((now - startDate) / 1000);
}

// ========================= SCROLL PERCENT =========================

/**
 * Tính tỷ lệ scroll theo 4 mức: 0 - 25 - 50 - 75 - 100
 */
const safe = (n) => Math.max(0, n);
function ftk_getScrollPercentage() {
	const scrollTop = safe(window.scrollY || document.documentElement.scrollTop);
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const percent = (scrollTop + windowHeight) / documentHeight * 100;

    return Math.min(100, Math.max(0, percent));
}

// ========================= GET USER ID FROM DOM =========================

/**
 * Lấy user_id từ DOM (.profile-idd)
 * Nếu không có -> Unknown
 */
function ftk_getUserId() {
	if ($(".profile-idd").length > 0) {
		return $(".profile-idd").text().replace(/\s+/g, "");
	}
	return "Unknown";
}

// ========================= AM TRACKING =========================
/**
 * Lấy thông tin affiliate từ cookie
 */
function ftk_getAffiliateInfo() {
    return {
        aff_network: ftk_getCookie("_aff_network"),
        aff_sid: ftk_getCookie("_aff_sid")
    };
}

// ========================= CLICK TRACKING =========================

document.addEventListener("DOMContentLoaded", function () {
	clickActionIsc();
	rewriteAttr();
});

// ========================= CUSTOM CLICK =========================
/**
 * 
 */
function clickActionIsc() {
	document.body.addEventListener("click", function (event) {
		const target = event.target.closest("[data-sp-action]");
		if (!target) return;

		// Nếu click phát sinh từ INPUT do label trigger → bỏ qua
		if (event.target.tagName === 'INPUT') return;
		// console.log(target);

		let action = target.getAttribute("data-sp-action");

		const screen_location = $("title").text();
		const area = target.getAttribute("data-sp-area") || null;
		const area_position = parseInt(target.getAttribute("data-sp-area-position"), 10) || null;
		const item_position = parseInt(target.getAttribute("data-sp-item-position"), 10) || null;
		const parent_id = target.getAttribute("data-parent-id") || null;
	
		const label = ftk_extractText(target);
		const additionalData = target.getAttribute("data-sp-extra");

		const startTime = ftk_getSessionStartTime();
		const eventTime = ftk_getSessionDurationInSeconds();
		const scrollPercentage = Math.round(ftk_getScrollPercentage());

		const affiliate = ftk_getAffiliateInfo();

		/**
		 * CLICK EVENT PAYLOAD
		 * - Luôn tạo event_id mới
		 * - Luôn thêm domain_userid
		 */
		let contextData = {
			schema: `iglu:vn.fpt.ftel.snowplow/${action}/jsonschema/1-0-0`,
			data: {
				event_name: action,
				area: area,
				area_position: area_position,
				item_position: item_position,
				label: label,
				parent_id: parent_id,
				screen_location: screen_location,
				user_id: ftk_getUserId(),
				sp_event_id: ftk_generateEventIdIsc(),
				sp_domain_userid: ftk_getDomainUserIdIsc(),
				device: ftk_detectDeviceTypeIsc(),
				device_id: ftk_getDeviceId(),
				operation_system: ftk_detectOSIsc(),
				location: ftk_getLocationName(),
				is_location: ftk_getLocationName() ? 1 : 0,
				is_fid: ftk_getCookie("fptvn_user_info") ? 1 : 0,
				session_startdate: ftk_formatDateTime(startTime),
				timestamp: ftk_getFormattedTimestamp(),
				event_time: eventTime,
				scroll_deep: scrollPercentage,
				affiliate_network: affiliate.aff_network,
				affiliate_id: affiliate.aff_sid,
				is_affiliate: affiliate.aff_sid ? 1 : 0,
			}
		};
		
		// console.log(additionalData);
		// Nếu có data-sp-extra (JSON) → merge vào payload
		if (additionalData) {
			try {
			// 	Object.assign(contextData.data, JSON.parse(additionalData));
				const extra = JSON.parse(additionalData);
                contextData.data = { 
					...contextData.data,
					...extra
				};
			} catch (err) {
				console.warn("Invalid JSON in data-sp-extra", err);
			}
		}

		// console.log(contextData);

		// Gửi event click
		if (typeof snowplowIsc === "function") {
			window.snowplowIsc("trackSelfDescribingEvent", { event: contextData });
		}
	});
}

// ========================= CUSTOM TRACKING (LOAD PAGE) =========================
/**
 * Tạm bỏ
 * Gửi event khi load page.
 * - Kèm sp_event_id mới, sp_domain_userid, device info, OS info...
 * 
 */
function trackingEventIsc(event_name = 'page_view', screen_location = 'Homepage') {
	let payload = {
		event_name: event_name,
		area: null,
		area_position: null,
		item_position: null,
		label: null,
		screen_location: screen_location,
		parent_id: null,
		user_id: ftk_getUserId(),
		sp_event_id: ftk_generateEventIdIsc(),
		sp_domain_userid: ftk_getDomainUserIdIsc(), 
		device: ftk_detectDeviceTypeIsc(),
		device_id: ftk_getDeviceId(),
		operation_system: ftk_detectOSIsc(),
		location: ftk_getLocationName(),
		is_location: ftk_getLocationName() ? 1 : 0,
		is_fid: ftk_getCookie('fptvn_user_info') ? 1 : 0,
		session_startdate: ftk_formatDateTime(ftk_getSessionStartTime()),
		timestamp: ftk_getFormattedTimestamp(),
		event_time: null,
		scroll_deep: null,
	};

	console.log(payload);

	if (typeof snowplowIsc === "function") {
		window.snowplowIsc("trackSelfDescribingEvent", {
			event: {
				schema: `iglu:vn.fpt.ftel.snowplow/${event_name}/jsonschema/1-0-0`,
				data: payload
			}
		});
	}
}

// ========================= CUSTOM EVENT =========================

// Submit form call f-tracking
/**
 * 
 * @param {*} action 
 * @param {*} extraData 
 * USAGE:
 * trackingCustomEventIsc("submit_form", {
 *     sp_event_id: "abc-override-id-123",
 *     sp_domain_userid: "custom-domain-999",
 * });
 */
function trackingCustomEventIsc(action = "custom_event", extraData = {}) {
    const screen_location = $("title").text();
    const startTime = ftk_getSessionStartTime();
    const eventTime = ftk_getSessionDurationInSeconds();
    const scrollPercentage = ftk_getScrollPercentage().toFixed(2);

	const affiliate = ftk_getAffiliateInfo();

    // TÁCH riêng 2 trường đặc biệt
    const {
        sp_event_id: customEventId,
        sp_domain_userid: customDomainId,
		area,
        area_position,
        item_position,
        label,
        parent_id,
        ...restExtra // phần còn lại không chứa 2 key kia
    } = extraData;

    const sp_event_id = customEventId || ftk_generateEventIdIsc();
    const sp_domain_userid = customDomainId || ftk_getDomainUserIdIsc();

    let payload = {
        event_name: action,
        area: area || null,
        area_position: area_position || null,
        item_position: item_position || null,
        label: label || null,
        parent_id: parent_id || null,
        screen_location: screen_location,
        user_id: ftk_getUserId(),
        sp_event_id,
        sp_domain_userid,
        device: ftk_detectDeviceTypeIsc(),
        device_id: ftk_getDeviceId(),
        operation_system: ftk_detectOSIsc(),
        location: ftk_getLocationName(),
        is_location: ftk_getLocationName() ? 1 : 0,
        is_fid: ftk_getCookie("fptvn_user_info") ? 1 : 0,
        session_startdate: ftk_formatDateTime(startTime),
        timestamp: ftk_getFormattedTimestamp(),
        event_time: eventTime,
        scroll_deep: scrollPercentage,

        ...restExtra // merge phần còn lại, không chứa 2 key đặc biệt
    };

	// Inject affiliate nếu tồn tại aff_sid
    if (affiliate.aff_sid) {
        payload = {
            ...payload,
            affiliate_network: affiliate.aff_network,
            affiliate_id: affiliate.aff_sid,
            is_affiliate: 1
        };
    }

    // console.log("CUSTOM TRACK EVENT:", payload);
	
    if (typeof snowplowIsc === "function") {
        window.snowplowIsc("trackSelfDescribingEvent", {
            event: {
                schema: `iglu:vn.fpt.ftel.snowplow/${action}/jsonschema/1-0-0`,
                data: payload
            }
        });
    }
}

// ========================= REWRITE ATTRIBUTE (LOAD PAGE) =========================
/**
 * 
 */
function rewriteAttr() {
	// 
	const section = document.querySelector(".product-categories");
	if (section) {
		const fromScreen     = section.getAttribute("data_sp_from_screen") || "";
		const dataArea       = section.getAttribute("data_sp_area") || "";
		const areaPosition   = section.getAttribute("data_sp_area_position") || "";

		section.querySelectorAll(".product-card").forEach((card, index) => {

			// Tìm thẻ <a> bên trong product-card
			const link = card.querySelector("a[title]");
			if (!link) return; // nếu card không có <a>, bỏ qua

			const linkTitle = link.getAttribute("title")?.trim() || "";

			// Action luôn gắn vào THẺ A (card chính)
			link.setAttribute("data-sp-action", "click_banner");
			link.setAttribute("data-sp-area", dataArea);
			link.setAttribute("data-sp-area-position", areaPosition);
			link.setAttribute("data-sp-item-position", index + 1);
			link.setAttribute("data-parent-id", fromScreen);

			const rawTitle = (link.getAttribute("title") || "").trim();

			// Normalize như PHP preg_replace('/[ -]+/', '_', strtolower())
			const normalizedTitle = rawTitle.trim().toLowerCase().replace(/[\s-]+/g, '_');
			const elementName = `view_${normalizedTitle}`;

			// Extra JSON — đừng xuống dòng trong template string JSON
			link.setAttribute(
				"data-sp-extra",
				JSON.stringify({
					area_item_id: areaPosition + '.' +(index + 1),
					element_name: elementName,
					element_type: "banner",
					event_custom: "click_banner",
					event_description: `View ${linkTitle} page`
				})
			);
		});
	}
}
