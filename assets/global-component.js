(() => {
    // 公共类可继承open属性
    const GlobalHTMLElement = class extends HTMLElement {
        static get observedAttributes() {
            return ["open"];
        }
        constructor() {
            super();
        }
        get open() {
            return this.hasAttribute("open");
        }
        set open(value) {
            if (value) {
                (async () => {
                    this.setAttribute("open", "");
                })();
            } else {
                this.removeAttribute("open");
            }
        }
        listenerKeydown() {
            document.addEventListener("keydown", (e) => {
                if (
                    this.open == true &&
                    e.code == "Escape"
                ) {
                    this.open = false;
                }
            });
        }
    }
    customElements.define("add-cart-fixed", class AddCartFixed extends HTMLElement {
        constructor() {
            super()
            this.init()
        }
        init() {
            const productForm = document.querySelector('.product-form__buttons')
            const _this = this
            if (!productForm) return
            const intersection = new IntersectionObserver(function (
                entries,
                observer
            ) {
                entries.forEach((entry) => {
                    entry.isIntersecting ? _this.classList.remove('show') : _this.classList.add('show')
                });
            });
            intersection.observe(productForm)
        }
    })


    customElements.define(
        "swiper-container",
        class SwiperContainer extends GlobalHTMLElement {
            swiper_options = {
                slidesPerView: 1,
                spaceBetween: 40,
                loop: false,
                autoplay: false,
                watchOverflow: true,
            };
            constructor() {
                super();
                this.lock = true
            }
            disconnectedCallback() {
                this.swiper.destroy(true, true)
            }
            connectedCallback() {
            }
            attributeChangedCallback(name, oldValue, newValue) {
                switch (name) {
                    case "open":
                        if (this.hasAttribute("open") && this.lock) {
                            this.lock = false
                            this.startSwiper()
                        }
                }
            }
            startSwiper() {
                this.initPagination()
                this.initSwiper();
                // 自定义切换按钮
            }

            initSwiper() {
                Object.keys(this.dataset).forEach((key) => {
                    this.swiper_options[key] = JSON.parse(this.dataset[key])
                });
                this.swiper = new Swiper(this.querySelector(".swiper"), {
                    ...this.swiper_options,
                });

            }
            slideTo(index) {
                this.swiper.slideTo(index);
            }
            initPagination() {
                if (this.querySelector(".swiper-button-next") && this.querySelector(".swiper-button-prev")) {
                    this.swiper_options.navigation = {
                        nextEl: this.querySelector('.swiper-button-next'),
                        prevEl: this.querySelector(".swiper-button-prev"),
                    };
                }
                if (this.querySelector('.swiper-pagination')) {
                    this.swiper_options.pagination = {
                        el: this.querySelector('.swiper-pagination'),
                        clickable: true,
                    }
                }
            }
        }
    );

    customElements.define('image-lazy', class ImageLazy extends HTMLElement {
        constructor() {
            super()
            this.image = this.querySelector('.img--lazyload')
            this.initImageLazyLoad()
        }

        initImageLazyLoad() {
            if ("IntersectionObserver" in window) {
                const lazyImageObserver = new IntersectionObserver(function (
                    entries,
                    observer
                ) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            let lazyImage = entry.target;
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.add("lazyloaded");
                            observer.unobserve(entry.target);
                        }
                    });
                });

                lazyImageObserver.observe(this.image);

            } else {
                let active = false;
                const _this = this
                let lazyLoad = () => {
                    if (active === false) {
                        active = true;
                        setTimeout(() => {
                            const lazyImage = _this.image
                            if (
                                lazyImage.getBoundingClientRect().top <= window.innerHeight &&
                                lazyImage.getBoundingClientRect().bottom >= 0 &&
                                getComputedStyle(lazyImage).display !== "none"
                            ) {
                                lazyImage.src = lazyImage.dataset.src;
                                // lazyImage.classList.remove("lazy");
                                lazyImage.classList.add("lazyloaded");

                                document.removeEventListener("scroll", lazyLoad);
                                window.removeEventListener("resize", lazyLoad);
                                window.removeEventListener("orientationchange", lazyLoad);
                            }
                            active = false;
                        }, 200);
                    }
                };
                document.addEventListener("scroll", lazyLoad);
                window.addEventListener("resize", lazyLoad);
                window.addEventListener("orientationchange", lazyLoad);
            }
        }
    })

})()