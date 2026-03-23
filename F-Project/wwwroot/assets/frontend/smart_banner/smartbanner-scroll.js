jQuery(document).ready(function ($) {
    const $body = $('body');
    const $header = $('.header_area');
    const $headerMenu = $('.header-menu');
    const $drawer = $('.mobile-drawer-content');
    
    const SMART_BANNER_HEIGHT = 52;
    let initialHeaderTop = null;

    function updateHeaderPosition() {
        // Nếu chưa có smartbanner thì thoát
        if (!$body.hasClass('smr-banner-added')) return;
        
        const scrollY = $(window).scrollTop();
        // Tính khoảng cách từ top body đến vị trí scroll hiện tại
        const distanceToTop = $body.offset().top - scrollY;
        // Lấy offset top thực tế của viewport (đặc biệt quan trọng trên mobile)
        const viewportOffsetTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
        // Chiều cao headerMenu để làm padding gốc
        const headerMenuHeight = $headerMenu.outerHeight();
        // 
        let headerTop;

        // Nếu trong khoảng banner thì cho header trượt theo
        if (distanceToTop <= SMART_BANNER_HEIGHT && distanceToTop > -1) {
            headerTop = distanceToTop + viewportOffsetTop;
            $header.css('top', headerTop + 'px');
        } else {
            // Khi cuộn vượt quá banner thì cố định top
            headerTop = viewportOffsetTop;
            $header.css('top', headerTop + 'px');
        }

        // Nếu chưa lưu initialHeaderTop thì set giá trị lúc này (banner vừa có -> trạng thái ban đầu)
        //  — điều này đảm bảo ta biết "ban đầu" header ở đâu so với viewport.
        if (initialHeaderTop === null) {
            initialHeaderTop = headerTop;
            // đảm bảo drawer ban đầu có đúng padding = headerMenuHeight
            $drawer.css('padding-top', headerMenuHeight + 'px');
            return; // lần đầu vừa khởi tạo, không cần tính tiếp
        }

        // header đã di chuyển lên bao nhiêu so với ban đầu
        const moved = Math.max(0, initialHeaderTop - headerTop);

        // padding phải giảm đúng bằng moved
        let newPadding = Math.round(headerMenuHeight - moved);
        if (newPadding < 0) newPadding = 0;

        $drawer.css('padding-top', newPadding + 'px');
    }

    // Gọi ngay khi DOM sẵn sàng
    updateHeaderPosition();

    // Khi scroll hoặc resize
    $(window).on('scroll resize', updateHeaderPosition);

    // Theo dõi thay đổi class trên body (phát hiện khi smartbanner được thêm sau)
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'class' && $body.hasClass('smr-banner-added')) {
                updateHeaderPosition();
            }
        }
    });
    observer.observe(document.body, { attributes: true });

    // Theo dõi thay đổi viewport (đặc biệt hữu ích khi address bar ẩn/hiện)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateHeaderPosition);
        window.visualViewport.addEventListener('scroll', updateHeaderPosition);
    }
});