(function () {
    // =========================
    // CHAT FORM STATE (GLOBAL TRONG IIFE)
    // =========================
    let chatFormState = {
        fullname: "",
        phone: "",
        email: "",
        service: ""
    };

    // ❗ FLAG: chỉ track chat_form 1 lần / 1 phiên chat
    let hasTrackedChatForm = false;

    // =========================
    // INIT
    // =========================
    document.addEventListener("DOMContentLoaded", function () {
        // DOM ready
    });

    // =========================
    // MESSAGE SOP HOOK LISTENER
    // =========================
    window.addEventListener("message", (event) => {
        if (event.data?.type !== "SOP_EVENT") return;

        const { action, ...payload } = event.data.payload || {};

        switch (action) {
            // Click vào bóng
            case "click_chat":
                // console.log("Chat Clicked. Is Open:", payload.isOpen);

                // 🔁 RESET STATE KHI CHAT ĐÓNG
                if (payload.isOpen === false) {
                    resetChatFormState();
                    resetChatFormTracking();
                    return;
                }

                // ✅ CHỈ TRACK KHI CHAT MỞ
                if (payload.isOpen === true) {
                    fireFtracking({
                        eventName: "click_form",
                        eventCustom: "click_chat",
                        event_description: "Click bóng chat SOP",
                        area: "sop_fchat_icon",
                        area_position: "1",
                        item_position: "1",
                        label: "Bóng chat SOP"
                    });
                }
                break;

            // Change field là gọi
            case "chat_form":
                handleChatForm(payload);
                break;

            // Click button chat
            case "start_chat":
                
                const userInfo = payload.user_info || {};
                const fullname = userInfo.fullname || userInfo["Họ và tên"] || "";
                const phone = userInfo.phone || userInfo["Số điện thoại"] || "";
                const email = userInfo.email || "";
                const rawService = userInfo.service || userInfo["Dịch vụ cần tư vấn"] || "";
                const normalizedService = normalizeService(rawService);

                // Đồng bộ lại state
                chatFormState.fullname = fullname;
                chatFormState.phone    = phone;
                chatFormState.email    = email;
                chatFormState.service  = normalizedService;

                // ❗ CHỈ TRACK KHI ĐỦ NAME + PHONE
                if (!isChatFormReady()) return;
                
                fireFtracking({
                    eventName: "submit_form",
                    eventCustom: "start_chat",
                    event_description: "Bắt đầu chat bóng SOP",
                    area: "sop_fchat_start",
                    area_position: "1",
                    item_position: "1",
                    label: "Chat với FPT Telecom",
                    fullname,
                    phone,
                    email,
                    service: normalizedService
                });
                break;

            default:
                console.log("Unknown Action:", action);
        }
    });

    // ----------------------------------------
    // HANDLERS
    // ----------------------------------------
    function handleChatForm(payload) {
        const { type, value } = payload.data || {};

        switch (type) {
            case "valid_name":
                chatFormState.fullname = value || "";
                console.log("Valid Name Entered:", chatFormState.fullname);
                break;

            case "valid_phone":
                chatFormState.phone = value || "";
                console.log("Valid Phone Entered:", chatFormState.phone);
                break;

            case "valid_email":
                chatFormState.email = value || "";
                console.log("Valid Email Entered:", chatFormState.email);
                break;

            case "select_service":
                chatFormState.service = normalizeService(value);
                console.log("Service Selected:", chatFormState.service);
                break;

            default:
                return;
        }

        // ❗ ĐÃ TRACK → KHÔNG TRACK LẠI
        if (hasTrackedChatForm) return;

        // ❗ CHỈ TRACK KHI ĐỦ NAME + PHONE
        if (!isChatFormReady()) return;

        fireFtracking({
            eventName: "change_form",
            eventCustom: "chat_form",
            event_description: "Click bóng chat SOP",
            area: "sop_fchat_form",
            area_position: "1",
            item_position: "1",
            label: "",
            fullname: chatFormState.fullname,
            phone: chatFormState.phone,
            email: chatFormState.email,
            service: chatFormState.service
        });

        hasTrackedChatForm = true;
    }

    // ----------------------------------------
    // COMMON TRACKING FUNCTION
    // ----------------------------------------
    function fireFtracking(payload) {

        const {
            eventName,
            eventCustom,
            area,
            label,
            ...data
        } = payload;

        trackingCustomEventIsc(eventName, {
            event_custom: eventCustom,
            area,
            parent_id: normalizeUrl(window.location.href),
            ...(label && { label }),
            ...data
        });
    }

    // ----------------------------------------
    // HELPERS
    // ----------------------------------------
    function normalizeService(service) {
        if (Array.isArray(service)) {
            return service
                .map(v => typeof v === "string" ? v.trim() : "")
                .filter(Boolean)
                .join(" | ");
        }
        return typeof service === "string" ? service.trim() : "";
    }

    function normalizeUrl(url) {
        try {
            const u = new URL(url);
            return (
                u.host.replace(/^www\./, "") +
                (u.pathname === "/" ? "" : u.pathname) +
                u.search +
                u.hash
            );
        } catch {
            return url;
        }
    }

    function isChatFormReady() {
        return (
            chatFormState.fullname.trim() !== "" && chatFormState.phone.trim() !== ""
        );
    }

    function resetChatFormState() {
        chatFormState.fullname = "";
        chatFormState.phone    = "";
        chatFormState.email    = "";
        chatFormState.service  = "";
        // console.log("Chat form state reset");
    }

    function resetChatFormTracking() {
        hasTrackedChatForm = false;
    }

})();
