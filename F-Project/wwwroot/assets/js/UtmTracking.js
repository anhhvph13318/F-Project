var Utm = {
    // utm_source – Nguồn truy cập (Traffic Source) -> Người dùng đến từ đâu?
    // utm_medium – Hình thức / kênh tiếp thị (Marketing Medium) -> Traffic đến bằng cách nào?
    // utm_campaign – Tên chiến dịch (Campaign Name) -> Traffic thuộc chiến dịch nào?
    // utm_term – Từ khóa / đối tượng mục tiêu -> Người dùng được nhắm tới theo keyword / segment nào?
    // utm_content – Biến thể nội dung / vị trí click -> Người dùng click vào nội dung cụ thể nào?
    // utm_full_url – URL đầy đủ kèm UTM (Custom – không chuẩn GA) -> Đây không phải UTM chuẩn của Google, mà là field custom do hệ thống tự định nghĩa.

    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    utm_full_url: "",
    utm_extra_campsource: "",

    getUtm: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.toString().length !== 0) {
            const campData = [
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_term',
                'utm_content',
                'utm_full_url',
                'utm_extra_campsource'
            ];
            campData.forEach(function(param) {

                if (urlParams.has(param)) {
                    sessionStorage.setItem(param, urlParams.get(param) || '');
                    localStorage.setItem(param, urlParams.get(param) || '');
                    
                    if(!urlParams.get('utm_content')){
                        // console.log('utm_content', param);
                        Utm.getUtmContent();
                    }

                }

            });
        }else{
            Utm.getUtmContent();
        }

    },
    extraTracking : function () {
        let urlParams = new URLSearchParams(window.location.search);
        let params = {};
        urlParams.forEach(function(value, key) {
            params[key] = value;
        });
        let result = {}
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if(key.includes('utm_extra_')){
                    result[key.replace(new RegExp('utm_extra_'), '')] = params[key]
                }
            }
        }
        if(Object.keys(result).length>0){
            sessionStorage.extra_tracking = JSON.stringify(result);
            localStorage.extra_tracking = JSON.stringify(result);
        }
    },
    getUtmContent : function () {
        // Lấy pathname của URL hiện tại
        let path = window.location.pathname;
        // console.log('path', path);
        // Tách phần sau dấu "/"
        let utm_content = path.replace(/^\/+/, '');

        
        if(utm_content == 'vi'){
            utm_content = 'home_page';
        }

        sessionStorage.setItem('utm_content', utm_content || '');
        localStorage.setItem('utm_content', utm_content || '');


        // console.log('utm_content', utm_content);
    },
    init : function (a) {
        this.utm_source = a.utm_source ? a.utm_source : "";
        this.utm_medium = a.utm_medium ? a.utm_medium : "";
        this.utm_campaign = a.utm_campaign ? a.utm_campaign : "";
        this.utm_term = a.utm_term ? a.utm_term : "";
        this.utm_content = a.utm_content ? a.utm_content : "";
        this.utm_full_url = a.utm_full_url ? a.utm_full_url : "";
        this.utm_extra_campsource = a.utm_extra_campsource ? a.utm_extra_campsource : "";
    }
}