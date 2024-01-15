import Swiper, { Pagination, Mousewheel, Scrollbar } from 'swiper';
import Cookies from 'js-cookie'
import Grassdoor from './grassdoor'
import axios from 'axios'

const $ = jQuery;

Swiper.use([
    Mousewheel,
    Scrollbar
])
  
// megamenu
class MegamenuComponent extends HTMLElement {
    constructor() {
        super();

        this.body = document.body
        this.overlay = document.querySelector('.js-megamenu-overlay')
        this.megamenuToggle = this.querySelector('.js-megamenu-toggle')
        this.megamenu = this.querySelector('.js-megamenu')
        this.subMegamenuToggles = this.querySelectorAll('.js-submegamenu-toggle')

        this.megamenuToggle.addEventListener('click', (e) => {
            e.preventDefault()
            this.body.classList.toggle('megamenu--open')
            this.classList.toggle('active')
        })

        for (const subMegamenuToggle of Array.from(this.subMegamenuToggles)) {
            subMegamenuToggle.addEventListener('click', (e) => {
                e.preventDefault()
                this.body.classList.toggle('megamenu--open')
                this.classList.toggle('active');
                jQuery(location).attr('href',e.srcElement.attributes.href.value);
            })
        }

        this.overlay.addEventListener('click', (e) => {
            e.preventDefault()
            this.body.classList.remove('megamenu--open')
            this.classList.remove('active')
        })

    }

}

customElements.define('megamenu-component', MegamenuComponent);

// mobile menu
class MobileMenuComponent extends HTMLElement {
    constructor() {
        super();

        this.mmOpen = this.querySelector('.js-mm--open')
        this.mmClose = this.querySelector('.js-mm--close')
        this.body = document.body

        this.mm = document.querySelector('.js-mm')

        this.mmOpen.addEventListener('click', (e) => {
            this.body.classList.add('mm--open')
            this.mm.focus()
        })

        this.mmClose.addEventListener('click', (e) => {
            this.body.classList.remove('mm--open')
        })

        this.subMmToggles = this.body.querySelectorAll('.js-mm-toggle')

        for (const subMmToggles of Array.from(this.subMmToggles)) {
            subMmToggles.addEventListener('click', (e) => {
                e.preventDefault()
                this.body.classList.toggle('mm--open')
                this.classList.toggle('active');
                jQuery(location).attr('href',e.srcElement.attributes.href.value);
            })
        }

    }

}

customElements.define('mobile-menu-component', MobileMenuComponent);


// pixel
class Pixel extends HTMLElement {
    constructor() {
        super();

        const body = document.body
        const header_height = window.screen.width < 1024 ? 116 : 132;

        let observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {

                body.classList.remove('nav--compressed')

                // If the Justuno plugin is not present - exit
                if (!body.querySelector('categories-component')) return;

                // Pixel.setCategoriesOffset(document.querySelector('header'), header_height);
            } else {
                body.classList.add('nav--compressed')

                // If the Justuno plugin is not present - exit
                if (!body.querySelector('categories-component')) return;

                // Pixel.setCategoriesOffset(document.querySelector('header'), 64);
            }

        });

        observer.observe(this);

        const promise = new Promise(function(resolve){
            var target = document.querySelector('header');
            var observer2 = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutationRecord) {
                    setTimeout(function (){
                        // Pixel.setCategoriesOffset(mutationRecord.target, mutationRecord.target.offsetHeight);
                        observer2.disconnect();
                        resolve('true');
                    }, 400);
                });
            });
            observer2.observe(target, { attributes : true, attributeFilter : ['style'] });
        });

        // promise.then(value => {
        //     window.scrollTo( 0, 0 );
        // });
    }

    // static setCategoriesOffset(target, offsetHeight) {
    //         // If the Justuno plugin has changed height
    //         if (!document.querySelector('categories-component')) return;
    //         let catComponentDiv = document.querySelector('categories-component').querySelector('div');
    //
    //         let el_style = window.getComputedStyle(target).top;
    //         el_style = parseInt(el_style.replace('px', ''));
    //         let summ = el_style + offsetHeight;
    //         catComponentDiv.style.top = summ + 'px';
    // };
}

customElements.define('pixel-component', Pixel);


// plp categories

// class CategoriesComponent extends HTMLElement {
//     constructor() {
//         super();
//
//         this.categories = this.querySelectorAll('.js-category')
//
//         this.navContainer = this.querySelector('.js-category-nav-container')
//         this.navItems = this.querySelectorAll('.js-category-nav')
//
//         for (const navItem of Array.from(this.navItems)) {
//             navItem.pos = navItem.getBoundingClientRect().x
//         }
//
//         let observer = new IntersectionObserver(entries => {
//             for (const entry of entries) {
//
//                 if (entry.isIntersecting) {
//                     this.removeActive()
//
//                     for (const navItem of Array.from(this.navItems)) {
//
//                         if (navItem.dataset.id == entry.target.dataset.id) {
//                             navItem.classList.add('active')
//                         }
//                     }
//                 }
//             }
//         });
//
//         for (const category of Array.from(this.categories)) {
//             observer.observe(category);
//         }
//     }
//
//     removeActive() {
//         for (const navItem of Array.from(this.navItems)) {
//             navItem.classList.remove('active')
//         }
//     }
// }

// customElements.define('categories-component', CategoriesComponent);



class CarouselComponent extends HTMLElement {
    constructor() {
        super();

        const swiperEl = this.querySelector('.swiper')

        const numberOfSlidesMobile = (this.dataset.number) ? parseInt(this.dataset.number) : 2.2

        const swiper = new Swiper(swiperEl, {
            modules: [Pagination],
            slidesPerView: 1.05,
            navigation: false,
            spaceBetween: 12,
            pagination: {
                el: '.swiper-pagination',
                type: 'progressbar',
            },
            breakpoints: {
                1024: {
                    slidesPerView: 3.3,
                    spaceBetween: 56,
                },
                480: {
                    slidesPerView: numberOfSlidesMobile,
                    spaceBetween: 32
                }
            },
        });

        const previousArrow = this.querySelector('.js-previous')
        const nextArrow = this.querySelector('.js-next')

        if (!previousArrow || !nextArrow) {
          return
        }

        previousArrow.addEventListener('click', (e) => {
            e.preventDefault()

            swiper.slidePrev()
        })

        nextArrow.addEventListener('click', (e) => {
            e.preventDefault()

            swiper.slideNext()
        })
    }
}

customElements.define('carousel-component', CarouselComponent);

class CategoriesGridComponent extends HTMLElement {
    constructor() {
        super();

        const swiperEl = this.querySelector('.swiper')

        const numberOfSlidesMobile = (this.dataset.number) ? parseInt(this.dataset.number) : 2.2

        const breakpoint = window.matchMedia('(min-width:1024px)');

        let mySwiper;

        const breakpointChecker = function() {
            if ( breakpoint.matches === true ) {
                if ( mySwiper !== undefined ) mySwiper.destroy( true, true );

                $(swiperEl).find('.swiper-slide').each(function (key, value) {
                    $(value).css('background-image', 'url(' + $(value).data('bg') +')');
                });
                return;
            } else if ( breakpoint.matches === false ) {
                return enableSwiper();

                $(swiperEl).find('.swiper-slide').each(function (key, value) {
                    $(value).css('background-image', 'url(' + $(value).data('bg') +')');
                });
            }
        };

        const enableSwiper = function() {
            mySwiper = new Swiper(swiperEl, {
                modules: [Pagination],
                slidesPerView: 1.2,
                navigation: false,
                spaceBetween: 7,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'progressbar',
                },
                breakpoints: {
                    480: {
                        spaceBetween: 14
                    }
                },
            });
        };

        breakpoint.addListener(breakpointChecker);

        breakpointChecker();
    }
}

customElements.define('categories-grid-component', CategoriesGridComponent);

class CategoriesOutOfStockComponent extends HTMLElement {
    constructor() {
        super();

        const swiperEl = this.querySelector('.swiper');

        const previousArrow = this.querySelector('.js-previous')
        const nextArrow = this.querySelector('.js-next')

        let mySwiper;



        let breakpoint = window.matchMedia('(min-width:1100px)');

        let breakpointChecker = function() {
            if ( breakpoint.matches === true ) {
                if (swiperEl.querySelectorAll('.swiper-slide').length <= 4) {
                    nextArrow.style.display = 'none';
                } else {
                    nextArrow.style.display = 'block';
                }
                return enableSwiper();
            } else if ( breakpoint.matches === false ) {
                if (swiperEl.querySelectorAll('.swiper-slide').length <= 3) {
                    nextArrow.style.display = 'none';
                } else {
                    nextArrow.style.display = 'block';
                }
                return enableSwiper();
            }
        };

        const enableSwiper = function() {
            mySwiper = new Swiper(swiperEl, {
                modules: [Pagination],
                slidesPerView: 3,
                navigation: false,
                spaceBetween: 11,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'progressbar',
                },
                breakpoints: {
                    1100: {
                        slidesPerView: 4,
                        spaceBetween: 9,
                    }
                },
                on: {
                    slideChangeTransitionStart: function(){
                        // on the first slide
                        if (mySwiper.activeIndex==0) {
                            $(previousArrow).hide()
                            $(nextArrow).show()
                        }
                        // most right postion
                        else if (mySwiper.activeIndex == mySwiper.slides.length-4) {

                            $(previousArrow).show()
                            $(nextArrow).hide()
                        }
                        // middle positions
                        else {
                            $(previousArrow).show()
                            $(nextArrow).show()
                        }
                    }
                },
            });
        };

        breakpoint.addListener(breakpointChecker);

        breakpointChecker();

        if (!previousArrow || !nextArrow) {
            return
        }

        previousArrow.addEventListener('click', (e) => {
            e.preventDefault()

            mySwiper.slidePrev()
        })

        nextArrow.addEventListener('click', (e) => {
            e.preventDefault()

            mySwiper.slideNext()
        })
    }
}

customElements.define('categories-out-of-stock-component', CategoriesOutOfStockComponent);


// gate

class GateComponent extends HTMLElement {
    constructor() {
        super();
        console.log('GateComponent constructor started')

        this.body = document.body
        this.form = this.querySelector('[data-js-grassdoor-zip-code-form]')
        this.formSubmit = this.querySelector('[data-js-grassdoor-zip-code-form-submit]')

        if (this.formSubmit) {
          this.formSubmitButton = this.formSubmit.querySelector('button')
        }

        console.log('zipcode loading from localStore')
        var zipcode = localStorage.getItem('ZIP_CODE')
        console.log('zipcode is "' + zipcode + '"')

        this.status = Cookies.get('gate-popup-closed')

        // Check if gate has been previously closed and reopen if false.
        // If no zipcode or status undefined, set it to false and open gate.
        if (!this.status || this.status == "false") {
            console.log('No zipcode or gate status undefined - open gate')
            this.body.classList.add('gate--open')
            Grassdoor.init()
            if (!this.status) {
                Cookies.set('gate-popup-closed', false)
            }
        } else if (this.status) {
            // Grassdoor.checkAvailability(zipcode)
        }

    }

}

customElements.define('gate-component', GateComponent);


// Klaviyo Newsletter Form
class NewsletterFormComponent extends HTMLElement {
    constructor() {
        super();

        this.form = this.querySelector('[data-js-newsletter-form]')
        this.formInput = this.querySelector('[data-js-newsletter-form-input]')

        if (!this.form) {
          return
        }

        this.form.onsubmit = async event => {
            event.preventDefault()

            await axios.post(
                'https://manage.kmail-lists.com/ajax/subscriptions/subscribe',
                new FormData(this.form),
            )
            .then(() => {
                this.formInput.value = null
                showSuccess()
            })
            .catch(() => {
                showError()
            })
        }

        const showSuccess = () => {
            this.form.classList.add('is-successful')
        }

        const showError = () => {
            this.form.classList.add('is-error')
        }
    }
}

customElements.define('newsletter-form-component', NewsletterFormComponent);

class NotifyFormComponent extends HTMLElement {
    constructor() {
        super();

        this.form = this.querySelector('[data-js-newsletter-form]');
        this.formInput = this.querySelector('[data-js-newsletter-form-input]');
        this.cat = this.form.dataset.plp;

        if (!this.form) {
            return;
        }

        this.form.onsubmit = async event => {
            event.preventDefault();

            await axios.post(
                'https://manage.kmail-lists.com/ajax/subscriptions/subscribe',
                new FormData(this.form),
            )
            .then(() => {
                this.formInput.value = null;
                window.location.href = this.cat;
            })
            .catch(() => {
                window.location.href = this.cat;
            })
        }
    }
}

customElements.define('notify-form-component', NotifyFormComponent);


// quantity

class QuantityComponent extends HTMLElement {
    constructor() {
        super();

        this.decrease_el = this.querySelector('.js-decrease')
        this.increase_el = this.querySelector('.js-increase')
        this.quantity_el = this.querySelector('.js-quantity')
        this.quantity = this.quantity_el.value

        this.increase_el.addEventListener('click', (e) => {
            this.quantity++
            this.quantity_el.value = this.quantity
        })

        this.decrease_el.addEventListener('click', (e) => {
            this.quantity--

            if (this.quantity < 0) {
                this.quantity = 0
            } else {
                this.quantity_el.value = this.quantity
            }
        })
    }


}

customElements.define('quantity-component', QuantityComponent);


// pdp images

class PDPImagesComponent extends HTMLElement {
    constructor() {
        super();

        this.thumbnails = this.querySelectorAll('.js-pdp-thumbnail')
        this.images = this.querySelectorAll('.js-pdp-image')

        for (const thumbnail of this.thumbnails) {
            thumbnail.addEventListener('click', (e) => {
                this.removeActive()

                thumbnail.classList.add('active')

                const active_image = Array.from(this.images).find(image => image.dataset.index == thumbnail.dataset.index)

                if (active_image) {
                    active_image.classList.add('active')
                }
            })
        }

        if (this.thumbnails.length > 0) {
            this.thumbnails[0].click()
        }

    }


    removeActive() {
        for (const thumbnail of this.thumbnails) {
            thumbnail.classList.remove('active')
        }

        for (const image of this.images) {
            image.classList.remove('active')
        }
    }

}

customElements.define('pdp-images-component', PDPImagesComponent);


class VariantSelectorComponent extends HTMLElement {
    constructor() {
        super();

        this.selector = this.getElementsByTagName('select')[0]

        this.selector.addEventListener('change', function (e) {
            window.location.href = this.value
        })

    }

}

customElements.define('variant-selector-component', VariantSelectorComponent);



class FAQComponent extends HTMLElement {
    constructor() {
        super();

        this.faqToggle = this.querySelector('.js-faq-toggle')

        this.faqToggle.addEventListener('click', (e) => {
            this.classList.toggle('active')
        })

    }

}

customElements.define('faq-component', FAQComponent);




class RelatedComponent extends HTMLElement {
    constructor() {
        super();

        this.selectors = {
            container: '[data-js-related-articles]',
            scrollbar: '[data-js-related-articles-scrollbar]',
          }
      
        this.swiperInstance = null

        const {
            selectors,
            } = this
      
        if (this.swiperInstance) {
            this.swiperInstance.destroy()
        }
    
        const container = document.querySelector(selectors.container)
    
        if (!container) {
            return
        }
    
        this.swiperInstance = new Swiper(
            container,
            {
                slidesPerView: 1,
                spaceBetween: 20,
                mousewheel: {
                    forceToAxis: true,
                },
                scrollbar: {
                    el: selectors.scrollbar,
                    draggable: true,
                },
                breakpoints: {
                    480: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 60,
                    },
                },
            },
        )

        console.log(this.swiperInstance)
    }


}

customElements.define('related-component', RelatedComponent);




class DataCaptureComponent extends HTMLElement {
    constructor() {
        super();

        this.form = this.querySelector('form')
        this.input_email = this.querySelector('[name="email"]')
        this.input_phone_number = this.querySelector('[name="phone_number"]')
        this.error_message = this.querySelector('.js-error-message')

        if (this.input_phone_number) {

            this.input_phone_number.addEventListener('input', () => {
                this.input_phone_number.setCustomValidity('')
                this.input_phone_number.checkValidity()
            })
            
            this.input_phone_number.addEventListener('invalid', () => {
                if (this.input_phone_number.value === '') {
                    this.input_phone_number.setCustomValidity('Enter phone number')
                } else {
                    this.input_phone_number.setCustomValidity('Enter phone number in this format: 1234567890')
                }
            })

        }
        
        this.form.onsubmit = async event => {
            event.preventDefault()

            if (!this.form) {
                return
            }

            const formData = new FormData(this.form)

            this.klaviyo_list = formData.get('g')
            this.email = formData.get('email')
            this.phone_number = formData.get('phone_number')

            if (this.email && this.phone_number) {

                let email_encoded = encodeURIComponent(this.email)

                await axios.post(
                    `/wp-json/klaviyo/v1/list/${this.klaviyo_list}/${this.phone_number}/${email_encoded}`
                )
                .then((e) => {

                    let data = JSON.parse(e.data)

                    if (data.detail) {
                        this.showErrorCustom(data.detail)
                    } else {
                        this.input_email.value = null
                        this.input_phone_number.value = null
                        this.showSuccess()
                    }

                })
                .catch((e) => {
                    console.log(e)
                    this.showError()
                })
            }

            else if (this.email) {
                await axios.post(
                    'https://manage.kmail-lists.com/ajax/subscriptions/subscribe',
                    new FormData(this.form),
                )
                .then(() => {
                    this.input_email.value = null
                    this.showSuccess()
                })
                .catch((e) => {
                    console.log(e)
                    this.showError()
                })
            }

            else if (this.phone_number) {
                await axios.post(
                    `/wp-json/klaviyo/v1/list/${this.klaviyo_list}/${this.phone_number}`
                )
                .then((e) => {
                    
                    let data = JSON.parse(e.data)

                    if (data.detail) {
                        this.showErrorCustom(data.detail)
                    } else {
                        this.input_phone_number.value = null
                        this.showSuccess()
                    }

                })
                .catch((e) => {
                    console.log(e)
                    this.showError()
                })
            }
        }
    }

    showSuccess = () => {
        this.form.classList.remove('is-error')
        this.form.classList.remove('is-error-custom')
        this.form.classList.add('is-successful')
    }

    showError = () => {
        this.form.classList.remove('is-successful')
        this.form.classList.remove('is-error-custom')
        this.form.classList.add('is-error')
    }

    showErrorCustom = (detail) => {
        this.form.classList.remove('is-successful')
        this.form.classList.remove('is-error')
        this.form.classList.add('is-error-custom')
        this.error_message.innerHTML = detail
    }

}

customElements.define('data-capture-component', DataCaptureComponent);

// Redirect by geotagging using 'Geolocation IP Detection' plugin
/*jQuery(document).ready(function($) {
    // geoip_detect.get_info().then(function(record) {
    //   if (record.error()) {
    //     console.error('WARNING Geodata Error:' + record.error() );
    //     return
    //   }
    //
    //   const ipAddress = record.get('traits.ipAddress');
    //   console.log('IP Address "' + ipAddress + '" detected');
    //
    //   const country = record.get('country.isoCode');
    //   console.log('Country "' + country + '" detected');
    //
    //   if (country == 'CA') {
    //     console.log('Redirecting to CA')
    //     window.location.href = 'http://ca.drinkcann.com/';
    //   }
    //
    //   const subdivision = record.get('mostSpecificSubdivision.isoCode');
    //   console.log('Subdivision "' + subdivision + '" detected');
    //
    //   if (country == 'US' && subdivision == 'MA') {
    //     console.log('Redirecting to MA')
    //     window.location.href = 'http://massachusetts.drinkcann.com/';
    //   }
    //
    // });

    fetch('https://api.ipstack.com/check?access_key=4da98221119b98e053399836232a97c6&format=1')
        .then( res => res.json())
        .then(response => {
            const ipAddress = response.ip;
            console.log('IP Address "' + ipAddress + '" detected');

            const country = response.country_code;
            console.log('Country "' + country + '" detected');

            if (country == 'CA') {
                console.log('Redirecting to CA')
                window.location.href = 'http://ca.drinkcann.com/';
            }

            const subdivision = response.region_code;
            console.log('Subdivision "' + subdivision + '" detected');

            if (country == 'US' && subdivision == 'MA') {
                console.log('Redirecting to MA')
                window.location.href = 'http://massachusetts.drinkcann.com/';
            }
        })
        .catch(error => {
            console.error('WARNING Geodata Error:' + record.error() );
            return
        })

});*/

document.addEventListener('DOMContentLoaded', function () {
    console.log('GETTING ZIP FROM IP')
    // variables
    let location_postal = localStorage.getItem('ZIP_CODE');

    let location_el = document.getElementById('location_el') ?? "";
    let location_close;
    let location_manual_form;

    // functions
    function showResult(result) {
        console.log('Show autodetected location on PDP', ['Location Detect Task']);
        let states = {
            'available' : "DELIVER TO",
            'error' : "ENTER YOUR LOCATION",
            'unavailable' : "UNAVAILABLE FOR DELIVERY TO"
        }
        if (result === true) {
            location_el.innerHTML = states['available'] + " " + localStorage.getItem('ZIP_CODE');
        } else if(result === 'not_detected') {
            location_el.innerHTML = states['error'];
        } else {
            location_el.innerHTML = states['unavailable'] + " " + localStorage.getItem('ZIP_CODE');
            window._klOnsite = window._klOnsite || [];
            window._klOnsite.push(['openForm', 'UR8MaH']);
        }
        location_el.parentElement.classList.replace('hidden', 'flex');
        location_manual_form.classList.replace('flex', 'hidden');
        document.getElementById('location_svg').classList.replace('hidden', 'block');
        location_el.classList.replace('hidden', 'block');
    }

    function toggleForm(e) {
        e.preventDefault();
        if (location_manual_form.classList.contains('hidden')) {
            location_manual_form.classList.replace('hidden', 'flex');
            document.getElementById('location_svg').classList.add('hidden');
            location_el.classList.add('hidden');
        } else {
            location_manual_form.classList.replace('flex', 'hidden');
            document.getElementById('location_svg').classList.replace('hidden', 'block');
            location_el.classList.replace('hidden', 'block');
        }
    }

    // fetching if not PDP Page
    async function fetchProductsNoPDP(zipcode) {
        console.log("fetchProductsNoPDP started")

        // initializeGrassdoorCart
        console.log("initializeGrassdoorCart started")
        let startInitGDCart = performance.now()
        await Grassdoor.initializeGrassdoorCart(zipcode)
        let endInitGDCart = performance.now()
        console.log(`initializeGrassdoorCart took ${endInitGDCart - startInitGDCart} milliseconds`)

        // Update the products based on GD information
        console.log('fetchProductInformation started')
        let startProdFetch = performance.now()
        await Grassdoor.fetchProductInformation(zipcode, 0, false)
        let endProdFetch = performance.now()
        console.log(`fetchProductInformation took ${endProdFetch - startProdFetch} milliseconds`);
    }

    // redirect by location (from options)
    function redirectByLocation(country, subdivision) {
        console.log('Geting redirect url...', ['RedirectByLocation Task']);
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200 && this.responseText) {
                if (this.responseText.includes('error')) {
                    console.log('Response error: "' + this.responseText + '"', ['RedirectByLocation Task']);
                } else {
                    console.log('Redirect to:', this.responseText , ['RedirectByLocation Task']);
                    window.location.href = this.responseText;
                }
            } 
        };
        
        xhttp.open("POST", "/wp-admin/admin-ajax.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (country && subdivision) {
            console.log('Send request for country "' + country + '" and subdivision "' + subdivision +'"', ['RedirectByLocation Task']);
            xhttp.send("action=get_redirect_urls&country=" + country + "&subdivision=" + subdivision);    
        } else if (country) {
            console.log('Send request for country "' + country + '"', ['RedirectByLocation Task']);
            xhttp.send("action=get_redirect_urls&country=" + country);
        }
    }

    function checkLocation() {
        console.log('Start get location from IP', ['Location Detect Task']);
        fetch('https://api.ipstack.com/check?access_key=4da98221119b98e053399836232a97c6&format=1')
            .then( res => res.json())
            .then(response => {
                console.log('Location from IP: Got response', ['Location Detect Task']);
                const ipAddress = response.ip;
                console.log('IP Address "' + ipAddress + '" detected');

                const country = response.country_code;
                console.log('Country "' + country + '" detected');

                //if (country == 'CA') {
                //    console.log('Redirecting to CA')
                //    window.location.href = 'http://ca.drinkcann.com/';
                //}

                const subdivision = response.region_code;
                console.log('Subdivision "' + subdivision + '" detected');

                redirectByLocation(country, subdivision);

                /*
                if (country == 'US' && subdivision == 'MA') {
                    console.log('Redirecting to MA')
                    window.location.href = 'http://massachusetts.drinkcann.com/';
                } else if (country == 'US' && subdivision == 'MN') {
                    console.log('Redirecting to MN')
                    window.location.href = 'https://h.drinkcann.com/';
                }
                */

                location_postal = location_postal ?? response.zip;
                console.log('ZIP Code from response - ' + response.zip, ['Location Detect Task']);
                if (location_postal) localStorage.setItem('ZIP_CODE', location_postal);
                console.log('ZIP Code to Grassdoor - ' + location_postal, ['Location Detect Task']);
                Grassdoor.init();
                
                // attach anonymous email
                console.log('`Create Anonymous Email', ['Location Detect Task']);
                try {
                    if (!localStorage.getItem('ajs_user_traits')) {
                        let anonymousEmail = grassdoorCart.createAnonymousEmail()
                        grassdoorCart.attachEmail(anonymousEmail, true)
                    }
                } catch (err) {
                    Grassdoor.modals.openErrorModal();
                }
           
                // if PDP Page
                if (location_el) {
                    Grassdoor.checkAvailability(location_postal).then(function (result) {
                        console.log('PDP Page. Grassdoor.checkAvailability got response', ['Location Detect Task'])
                        if (location_el) showResult(result);
    
                    });
                    console.log('PDP Page. ZIP CODE - ' + location_postal, ['Location Detect Task']);
                    location_manual_form = document.getElementById('location_manual_form');
                    location_close = location_manual_form.querySelector('.close');
                    location_el.addEventListener('click', (e) => toggleForm(e));
                    location_close.addEventListener('click', (e) => toggleForm(e));

                    location_manual_form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const formProps = Object.fromEntries(formData);

                        if (!formProps['location_zip'] && !(/^\d{5}(?:-\d{4})?$/.test(formProps['location_zip']))) return;

                        localStorage.setItem('ZIP_CODE', formProps['location_zip']);

                        if (!Grassdoor) Grassdoor.init();

                        Grassdoor.checkAvailability(formProps['location_zip']).then(function (result) {
                            showResult(result);
                        });
                    })
                } else {
                    fetchProductsNoPDP(location_postal)
                }

                // if Find A Cann page
                if (window.location.pathname.indexOf('find-a-cann') > -1) {
                    Grassdoor.checkAvailability(location_postal).then((response) => {
                        if (!response) {
                            window._klOnsite = window._klOnsite || [];
                            window._klOnsite.push(['openForm', 'UR8MaH']);
                        }
                    })
                }
            })
            .catch(error => {
                console.log('ZIP Code not detect', ['Location Detect Task']);
                showResult('not_detected');
            });
    }

    // Correction of errors in the formation of discounts in the cart from the Grasdoor side.
    function applyDiscountToCart(mutationsList, observer) {
        var discountCode = JSON.parse(window.localStorage.getItem('PROMO_REPO'))
        
        if (!discountCode) {
            return
        }
        
        const gdList= document.querySelector('.gd-list')
        if (!gdList || gdList.classList.contains('discounted')) return

        var subtotal = 0
        var discountedSubtotal = 0
        var currency = ''
        const productElements = gdList.querySelectorAll('.gd-product')
        for (let i = 0, total = productElements.length; i < total; i++) {
            const productElement = productElements[i]
            // get gdMappingID
            const gdDelBtn = productElement.querySelector('.gd-delete-btn')
            let gdDelBtnStr = gdDelBtn.getAttribute('onclick')
            let matchInt = gdDelBtnStr.match(/[0-9]+/g)
            let grassdoorId = parseInt(matchInt[0])
            
            // get GD product data
            let grassdoorProductData = window.grassdoorProducts.find(item => item.mappingId === grassdoorId)
            
            // get product price and count
            const productPriceContainer = productElement.querySelector('.gd-price')
            let priceStr = productPriceContainer.innerHTML.replace(/[^0-9]/g, '')
            let price = parseInt(priceStr)
            const productCountContainer = productElement.querySelector('.gd-count')
            let count = parseInt(productCountContainer.innerHTML)
            let isDiscounted = false
            if (price && count) {

                // set discountedPrice
                let discountedPrice = price
                if (discountCode.type == 1) {
                    discountedPrice = price * (1 - (discountCode.discount / 100))
                    isDiscounted = true
                } else if (discountCode.type == 2) {
                    // discount only for "product_ids" if "coupon_type" = 4
                    if (discountCode.coupon_type == 4 && !(discountCode.product_ids.includes(grassdoorProductData.id))) {
                        discountedPrice = price
                    } else {
                        discountedPrice = price * (1 - (discountCode.discount / 100))
                        isDiscounted = true
                    }
                }

                let discountedPriceStr = discountedPrice.toFixed(2)
                subtotal += (price * count)
                discountedSubtotal += (discountedPrice * count)
                currency = grassdoorProductData.currency
                if (isDiscounted) { productPriceContainer.innerHTML = `<span class="discounted-price">${currency}${grassdoorProductData.salePrice}</span> ${currency}${discountedPriceStr}` }
            }
        }
        const totalPriceContainer = document.querySelector('.gd-total-price')
        discountedSubtotal = discountedSubtotal.toFixed(2)
        if (subtotal != discountedSubtotal) {
            totalPriceContainer.innerHTML = `<span class="discounted-price">${currency}${subtotal}</span> ${currency}${discountedSubtotal}`
        }
        gdList.classList.add('discounted');
    }

    // Observe cart to correction of errors in the formation of discounts in the cart from the Grasdoor side.
    var gdCartContainer = document.getElementById('grassdoor-cart-container');
    const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };
    const cardObserver = new MutationObserver(applyDiscountToCart);
    cardObserver.observe(gdCartContainer, observerConfig);

    if (Cookies.get('agePopup') || location_postal) {
        checkLocation();
    } else {
        document.querySelector('[data-js-grassdoor-zip-code-form]').addEventListener('submit', function(e) {
            // set age confirm token
            grassdoorCart.setAgeConfirmation().then(result => {
                console.log('setAgeConfirmation ended', ['Location Detect Task']);
                checkLocation();
            })
        })
    }

    let nav = document.querySelectorAll('.category-nav-container');

    if (nav.length > 0) {
        let navLinks = document.querySelectorAll('.category-nav-container .category-nav');
        let activeLink = document.querySelector('.category-nav.active');

        if (activeLink) {
            setTimeout(function() {
                activeLink.scrollIntoView({ behavior: "smooth", inline: "end" });
                },300)
        }
    }

    const unavailable_modal = document.querySelector("[data-js-unavailable-modal]");
    if (unavailable_modal) {
        unavailable_modal.querySelector('.popup__close').addEventListener('click', function(e) {
            e.preventDefault();
            unavailable_modal.classList.remove('is-open');
            document.body.classList.remove("gate--open");
        })
    }

    jQuery(document).on('click', '.js-mm--open', function(e){
        let mmenu = jQuery(".mob-menu-warapper");
        let el_top = window.getComputedStyle(document.querySelector('header')).top;
        el_top = parseInt(el_top.replace('px', ''));

        let el_height = document.querySelector('header').offsetHeight;
        mmenu.css('padding-top', el_top + el_height)
    })

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            jQuery('.overflow-wrapper').css('height', 'calc(100vh - 219px - '+ document.querySelector('.site-header').style.top +')');
        });
    });

    var target = document.querySelector('.site-header');
    observer.observe(target, { attributes : true, attributeFilter : ['style'] });


}, false);

window.onload = function () {
	document.body.classList.add('loaded_hiding');
	window.setTimeout(function () {
		document.body.classList.add('loaded');
		document.body.classList.remove('loaded_hiding');
	}, 500);
}