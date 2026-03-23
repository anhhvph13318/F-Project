/**
 * lazyloaded:
 * Add: Class .lazy-img
 * Elem: <img class="lazy-img" src='path_loading_image' data-src="path_image" alt="">
 * Addon: 
 * // <script>
 * //     window.APP_CONFIG = {
 * //         loadingPlaceholder: "path_loading_image",
 * //         fallbackSrc: "path_no_image"
 * //     };
 * // </script>
 */

// init
$(function($) {
    _pg.init();
});

// function
const _pg = {
    init: function() {
        var self = this;  

        // Manual: Phải set thêm data-src, class "lazy-img"
        self.jq_lazyload(); 
        self.jq_lazycss();

        // Auto: Phải set thêm class "lazy-img" (Không xịn lắm, ko tốt)
        // self.jq_lazyload_type_auto(); 
    },
    jq_lazyload: function() {
        // --------------
        const fallbackSrc = window.APP_CONFIG.fallbackSrc;
        const lazyImages = $('.lazy-img');

        if (lazyImages.length === 0) return;

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = $(entry.target);
					const src = img.data('src');

					// Ngăn sự kiện 'error' cũ dính lại
					img.off('error');

					// Gán sự kiện 'load'
					img.on('load', function () {
						img.addClass('loaded');
					});

					// Gán sự kiện 'error'
					img.on('error', function () {
						const currentSrc = img.attr('src');

						// Nếu đang không phải là fallback => fallback
						if (currentSrc !== fallbackSrc) {
							console.warn('Ảnh lỗi, fallback:', currentSrc);
							img.attr('src', fallbackSrc);
						} else {
							console.warn('Fallback cũng lỗi. Bỏ qua.');
							img.off('error'); // Ngắt vòng lặp
						}

						img.addClass('loaded');
					});

					// Đặt src để bắt đầu load ảnh thật
					img.attr('src', src);

					// Ngưng theo dõi
					observer.unobserve(entry.target);
				}
			});
		}, {
			rootMargin: '100px',
		});

		lazyImages.each(function () {
			observer.observe(this);
		});
	},
    jq_lazyload_type_auto: function() {
        
        /**
         * HTML
         */
        // --> Add them thang nay ở layout
        // <script>
        //     window.APP_CONFIG = {
        //         loadingPlaceholder: "{{ asset('/frontend_layout_2025/assets/images/loading_icon.gif') }}",
        //         fallbackSrc: "{{ asset('/fontend_v2.0_2024/assets/images/no-image.png') }}"
        //     };
        // </script>
        // --> thẻ này dùng cho HTML
        // <img class="lazy-img" src="{{$item['images']}}" alt="{{$item['display_name'] }}" />
        // --------------
        const loadingPlaceholder = window.APP_CONFIG.loadingPlaceholder;
        const fallbackSrc = window.APP_CONFIG.fallbackSrc;

        const lazyImages = $('.lazy-img');
        
        if (lazyImages.length === 0) return;

        lazyImages.each(function () {
            const img = $(this);

            const realSrc = img.attr('src');
            if (!realSrc) return;

            // Lưu ảnh thật vào data-src
            img.attr('data-src', realSrc);

            // Tạm thời thay src = loading
            img.attr('src', loadingPlaceholder);
        });

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = $(entry.target);
                    const src = img.data('src');

                    if (!src) return;

                    // Clear old error listener
                    img.off('error');

                    // Load success
                    img.on('load', function () {
                        img.addClass('loaded');
                    });

                    // Load fail → fallback
                    img.on('error', function () {
                        const currentSrc = img.attr('src');
                        if (currentSrc !== fallbackSrc) {
                            console.warn('Ảnh lỗi, fallback:', currentSrc);
                            img.attr('src', fallbackSrc);
                        } else {
                            console.warn('Fallback cũng lỗi. Bỏ qua.');
                            img.off('error');
                        }
                        img.addClass('loaded');
                    });

                    // Gán ảnh thật
                    img.attr('src', src);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px',
        });

        lazyImages.each(function () {
            observer.observe(this);
        });
    },
    jq_lazycss: function() {
        $('<style>')
            .prop('type', 'text/css')
            .html(`
                .lazy-img {
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                }
                .lazy-img.loaded {
                    opacity: 1;
                }
            `)
            .appendTo('body');
    }
}