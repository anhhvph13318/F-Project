if ($(".swiper.sw-video").length > 0) {
    function sw_video() {
        var swiper = new Swiper('.swiper.sw-video', {
            slidesPerView: 4,
            spaceBetween: 24,
            navigation: {
                nextEl: '.parents_video .swiper-button-next',
                prevEl: '.parents_video .swiper-button-prev',
            },
            breakpoints: {
                1500: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
                884: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
                834: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                768: {
                    slidesPerView: "auto",
                    spaceBetween: 16,
                },
                767: {
                    slidesPerView: "auto",
                    spaceBetween: 16,
                },
                320: {
                    slidesPerView: "auto",
                    spaceBetween: 16,
                },
            },

            lazy: true,
            // touchStartPreventDefault: false,

        });
    }

    $(document).ready(function () {
        sw_video();

        if ($(".parents_video .swiper-button-disabled.swiper-button-lock").length > 0) { // check if swiper button is locked
            $(".swiper.sw-video .swiper-wrapper").addClass('js_video_center_');// cho center khi xác định ko xuất hiện silde: js_video_center
        }
    });
}