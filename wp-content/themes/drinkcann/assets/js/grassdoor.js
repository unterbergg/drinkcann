import axios from 'axios'
import Cookies from 'js-cookie'
import algoliasearch from "algoliasearch/lite"

const $ = jQuery;

//get the params of discount
class GrassdoorDiscounts {
    constructor(){
        const path=window.location;

        //URL parameters
        const url= new URL(path)

        const discountParam=url.searchParams.get('discount')

        if (!discountParam)
            return

        Cookies.set('cann-discount',discountParam)
    }
}

class GrassdoorModals {
    constructor() {
        this.selectors = {
            zipcodeModal: "[data-js-zip-code-modal]",
            gateModal: "[data-js-gate-modal]",
            unavailableModal: "[data-js-unavailable-modal]",
            collectModal: "[data-js-collect-modal]",
            errorModal: "[data-js-error-modal]",
            noThanks: "[data-js-no-thanks]",
            collectEmailSubmit: "[data-collect-email-submit]"
        }

        this.stateClasses = {
            isOpen: "is-open",
            gateOpen: "gate--open",
        }
    }

    clickOutside(element, callback) {
        const stopPropagation = (event) => {
            event.stopPropagation()
        }

        const handleClickOutside = () => {
            document.removeEventListener("click", handleClickOutside)
            element.removeEventListener("click", stopPropagation)
            callback()
        }

        document.addEventListener("click", handleClickOutside)
        element.addEventListener("click", stopPropagation)
    }

    openGate() {
        document.body.classList.add(this.stateClasses.gateOpen)
    }

    closeGate() {
        document.body.classList.remove(this.stateClasses.gateOpen)
    }

    openZipcodeModal() {

        var notavail = localStorage.getItem('NOT_AVAILABLE_SHOWN');

        if(notavail == 'true') {
            Cookies.set('gate-popup-closed', true)
            document.body.classList.remove('gate--open')
            return false;
        }



        const modal = document.querySelector(this.selectors.zipcodeModal)

        if (modal) {
            modal.classList.add(this.stateClasses.isOpen)
            // add fullscreen modal mode
            const gateModal = document.querySelector(this.selectors.gateModal)
            if (gateModal) {
                gateModal.style.backgroundColor = '#fcfbed'
            }
        }
    }

    closeZipcodeModal() {
        const isOpenCssClass = this.stateClasses.isOpen
        const modal = document.querySelector(this.selectors.zipcodeModal)

        if (modal && modal.classList.contains(isOpenCssClass)) {
            modal.classList.remove(isOpenCssClass)
            // remove fullscreen modal mode
            const gateModal = document.querySelector(this.selectors.gateModal)
            if (gateModal) {
                gateModal.style.backgroundColor = null
            }
        }
    }

    openErrorModal() {
        this.closeZipcodeModal()
        const modal = document.querySelector(this.selectors.errorModal)

        if (modal) {
            modal.classList.add(this.stateClasses.isOpen)
            this.clickOutside(modal, () => {
                this.closeErrorModal()
            })
        }
    }

    closeErrorModal() {
        const modal = document.querySelector(this.selectors.errorModal)

        if (modal) {
            modal.classList.remove(this.stateClasses.isOpen)
        }

        const zipCode = localStorage.getItem('ZIP_CODE')

        if (zipCode) {
            this.closeGate()
        } else {
            this.openZipcodeModal()
        }
    }

    openUnavailableModal() {
        this.closeZipcodeModal()
        // document.body.classList.remove('gate--open')


        fetch('https://api.ipstack.com/check?access_key=4da98221119b98e053399836232a97c6&format=1')
            .then( res => res.json())
            .then(response => {
                console.log(response);
                if(response.country_code == 'CA') {
                    document.body.classList.remove('gate--open')
                } else {

                    const modal = document.querySelector(this.selectors.unavailableModal)

                    if (modal) {
                        modal.classList.add(this.stateClasses.isOpen)
                        this.clickOutside(modal, () => {
                            this.closeUnavailableModal()
                        })
                    }

                }
            })
            .catch((data, status) => {

                const modal = document.querySelector(this.selectors.unavailableModal)

                if (modal) {
                    modal.classList.add(this.stateClasses.isOpen)
                    this.clickOutside(modal, () => {
                        this.closeUnavailableModal()
                    })
                }


            });



    }


    openCollectModal() {
        this.closeZipcodeModal()
        // document.body.classList.remove('gate--open')


        const modal = document.querySelector(this.selectors.collectModal)
        const nothanks = document.querySelector(this.selectors.noThanks)
        const collectEmailSubmit = document.querySelector(this.selectors.collectEmailSubmit)








        if (modal) {


            var data = this;

            nothanks.onclick = function(){
                data.closeCollectModal();
            };


            collectEmailSubmit.onclick = function(){
                var email = document.getElementById('grassdoor_email_popup').value;
                if (!window.localStorage.getItem('ajs_user_traits') && validateEmail(email)) {
                    grassdoorCart.attachEmail(email)
                } else {
                    const userTraits = JSON.parse(window.localStorage.getItem('ajs_user_traits'))
                    if (userTraits && userTraits.email && validateEmail(userTraits.email)) {
                        if (validateEmail(userTraits.email) && validateEmail(email)) {
                            grassdoorCart.updateEmail(userTraits.email, email);
                        }
                    }
                }
                data.closeCollectModal();
            };

            document.body.classList.add('gate--open')
            modal.classList.add(this.stateClasses.isOpen)
            this.clickOutside(modal, () => {
                this.closeCollectModal()
            })
        }



    }



    closeUnavailableModal() {

        // alert('closing unavailable model')

        const modal = document.querySelector(this.selectors.unavailableModal)

        if (modal) {
            modal.classList.remove(this.stateClasses.isOpen)
        }

        const zipCode = localStorage.getItem('ZIP_CODE')

        if (zipCode) {
            this.closeGate()
        } else {
            this.closeGate();
            Cookies.set('gate-popup-closed', true)
            document.body.classList.remove('gate--open')

            //  this.openZipcodeModal()
        }
    }

    closeCollectModal() {


        const modal = document.querySelector(this.selectors.collectModal)



        if (modal) {
            modal.classList.remove(this.stateClasses.isOpen)
        }

        const zipCode = localStorage.getItem('ZIP_CODE')

        if (zipCode) {
            this.closeGate()
        } else {
            this.closeGate();
            Cookies.set('gate-popup-closed', true)
            document.body.classList.remove('gate--open')

            //  this.openZipcodeModal()
        }
    }


}

class AlgoliaSearch {
    constructor() {
        const APPLICATION_ID = "TJYFSB3LRV"
        const SEARCH_API_KEY = "3a93e074d22b4cf17460bcad75b096be"
        const ALGOLIA_INDEX = "dev_locations"

        const client = algoliasearch(APPLICATION_ID, SEARCH_API_KEY)
        this.instance = client.initIndex(ALGOLIA_INDEX)
    }

    async resultsInZipCode (zipcode) {
        const { nbHits } = await this.instance.search(zipcode, {
            timeout: 3000,
            restrictSearchableAttributes: [
                'zipcode',
            ]
        })

        return nbHits
    }

    async resultsInState (state) {
        const { nbHits } = await this.instance.search(state, {
            timeout: 3000,
            restrictSearchableAttributes: [
                'state',
            ]
        })

        return nbHits
    }
}

const validateCanadaZip = (zipCode) => {
    return zipCode.match(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
    );
};

export default new class {
    constructor() {
        this.selectors = {
            zipCodeForm: '[data-js-grassdoor-zip-code-form]',
            zipCodeFormInput: '[data-js-grassdoor-zip-code-form-input]',
            gateModal: '[data-js-gate-modal]',
            unavailableModal: '[data-js-unavailable-modal]',
            product: '[data-js-grassdoor-product]',
            viewedProduct: '[data-track-viewed-product]',
            productForm: '[data-js-grassdoor-product-form]',
            productPrice: '[data-js-grassdoor-product-price]',
            productCta: '[data-js-grassdoor-product-cta]',
            productCtaText: '[data-js-grassdoor-product-cta-text]',
            cart: 'grassdoor-cart-container',
            cartTrigger: '[data-js-grassdoor-cart-trigger]',
            counterProducts:'[data-js-count]',
            quantityProducts:'[data-js-quantity]',
            findaCannButton: '[data-js-find-a-cann]'
        }

        this.stateClasses = {
            loading: 'is-loading',
            updating: 'is-updating',
            disabled: 'is-disabled',
            soldOut: 'is-sold-out',
            isOpen: 'is-open',
            isVisible: 'is-visible',
        }
        this.discounts= new GrassdoorDiscounts()

        this.modals = new GrassdoorModals()

        this.BASE_URL = 'https://api.grassdoor.com/api/v3'
        this.API_KEY = 'RHJpbmtjYW5uOkRyaW5rY2FublNlY3JldA=='

        this.axios = axios.create({
            baseURL: this.BASE_URL,
            headers: {
                'x_api_key': this.API_KEY,
            },
        })

        this.ADDRESS_ENDPOINT = '/address?lat=0&lng=0'
        this.LIST_PRODUCTS_ENDPOINT = '/products/listproducts/2'
        this.CART_ENDPOINT = 'https://api.grassdoor.com/api/v3'
        this.CHECKOUT_URL = `${window.location.origin}/cart`

        this.soldOutLink = JSON.parse(document.querySelector('.js-products').innerHTML).sold_out_link
        this.cta = JSON.parse(document.querySelector('.js-products').innerHTML).cta
    }

    init() {

        fetch('https://api.ipstack.com/check?access_key=4da98221119b98e053399836232a97c6&format=1')
            .then( res => res.json())
            .then(response => {
                this.initializeZipCodeForm();
            })
            .catch((data, status) => {
                this.initializeZipCodeForm();
            });



    }

    initializeZipCodeForm() {
        console.log("initializeZipCodeForm started")

        const {
            selectors,
            stateClasses,
        } = this
        this.modals.openZipcodeModal()
        const form = document.querySelector(selectors.zipCodeForm)

        if (!form) {
            return
        }

        const input = form.querySelector(selectors.zipCodeFormInput)
        form.onsubmit = async event => {
            event.preventDefault()

            // // set age confirm token
            // grassdoorCart.setAgeConfirmation()

            try {
                // const isAvailable = await this.checkAvailability()

                // if (isAvailable) {
                //     if (!window.localStorage.getItem('ajs_user_traits')) {
                //         var anonymousEmail = grassdoorCart.createAnonymousEmail()
                //         grassdoorCart.attachEmail(anonymousEmail, true)
                //     }
                // }

                this.modals.closeGate()
                this.modals.closeZipcodeModal()
                Cookies.set('gate-popup-closed', true)

            } catch (err) {
                this.modals.closeZipcodeModal()
                this.modals.openErrorModal()
            }

        }



    }

    checkLocation() {
        console.log('check location');
    }

    // Check if 'Find A Cann' location by zip code
    checkFindacannLocation(zipCode) {
        console.log('checkFindacannLocation starting', ['checkFindacannLocation Task'])
        try {
            let zipNum = parseInt(zipCode);
            // Arizona
            if ((zipNum > 84999) && (zipNum < 86557) ) {
                console.log('is Find A Cann location - Arizona', ['checkFindacannLocation Task'])
                return true
            }
            // Nevada
            if ((zipNum > 88899) && (zipNum < 89884) ) {
                console.log('is Find A Cann location - Nevada', ['checkFindacannLocation Task'])
                return true
            }

        } catch (error) {
            console.log('zipcode parse error:' + error, ['checkFindacannLocation Task'])
            return false
        }
        return false
    }
    

    async checkAvailability(zipCode) {

        console.log("checkAvailability started")
        try {
            let zipcode = zipCode;
            console.log(zipCode, 'zipcode from params');
            if (!zipCode) {
                console.log('zipcode loading from localStore')
                zipcode = localStorage.getItem('ZIP_CODE')
            }

            console.log('zipcode is "' + zipcode + '"')

            // checkGrassdoorAvailability
            console.log('checkGrassdoorAvailability started')
            let startGDAviable = performance.now()
            var isAvailableInGrassdoor = await this.checkGrassdoorAvailability(zipcode)
            sessionStorage.setItem('location_availability', isAvailableInGrassdoor);
            let endGDAviable = performance.now()
            console.log(`checkGrassdoorAvailability took ${endGDAviable - startGDAviable} milliseconds`)

            // checkGrassdoorAvailability
            console.log('checkAlgoliaAvailability started')
            let startAlgoliaAviable = performance.now()
            try {
                var isAvailableInAlgolia = await this.checkAlgoliaAvailability(zipcode)
            } catch (error) {
                console.log('checkAlgoliaAvailability error: ' + error);
                var isAvailableInAlgolia = true
            }
            let endAlgoliaAviable = performance.now()
            console.log(`checkAlgoliaAvailability took ${endAlgoliaAviable - startAlgoliaAviable} milliseconds`)

            // initializeGrassdoorCart
            console.log("initializeGrassdoorCart started")
            let startInitGDCart = performance.now()
            await this.initializeGrassdoorCart(zipcode)
            let endInitGDCart = performance.now()
            console.log(`initializeGrassdoorCart took ${endInitGDCart - startInitGDCart} milliseconds`)

            // Update the products based on GD information
            console.log('fetchProductInformation started')
            let startProdFetch = performance.now()
            await this.fetchProductInformation(zipcode, 0)
            let endProdFetch = performance.now()
            console.log(`fetchProductInformation took ${endProdFetch - startProdFetch} milliseconds`);

            //check if 'Find a Cann' Location by zipcode
            var isFindaCannLocation = this.checkFindacannLocation(zipcode)

            if (!isFindaCannLocation && isAvailableInGrassdoor) {
                // if GD is available, everything is good
                this.enableProductForm();
                this.disableFindaCann();
                return true
            } else if (!isFindaCannLocation && isAvailableInAlgolia) {
                // if is not valid in GD but in valid state
                this.disableProductForm()
                this.enableFindaCann()
                return true
            } else {
                // if is not valid in GD and unavailable in state
                var notavail = localStorage.getItem('NOT_AVAILABLE_SHOWN');
                if(notavail == 'true') {

                } else {
                    // this.modals.openGate()
                    // this.modals.openUnavailableModal()
                    localStorage.setItem('NOT_AVAILABLE_SHOWN', 'true')
                }
                if (document.querySelectorAll('[data-js-find-a-cann]').length) this.disableProductForm();
                this.enableFindaCann()
                return false
            }
        } catch (error) {
            return true
        }
    }

    async checkGrassdoorAvailability(zipCode) {
        const {
            ADDRESS_ENDPOINT,
        } = this

        try {
            console.log('Try to get availbility status from GD (checkGrassdoorAvailability) with zipcode "' + zipCode + '"');
            const response = await this.axios.get(
                ADDRESS_ENDPOINT,
                {
                    timeout: 5000,
                    headers: {
                        postcode: zipCode,
                    },
                },
            )

            return response.data.data.isAvailable
        } catch (error) {
            console.log(ADDRESS_ENDPOINT + " getting error (checkGrassdoorAvailability): " + error);
            return true
        }
    }

    async checkAlgoliaAvailability(zipCode) {
        const algolia = new AlgoliaSearch()
        const results = await algolia.resultsInZipCode(zipCode)
        return results > 0
    }

    enableFindaCann() {
        const {
            selectors,
            stateClasses,
        } = this
        const findCannButtons = document.querySelectorAll(selectors.findaCannButton)
        for (let index = 0; index < findCannButtons.length; index++) {
            const button = findCannButtons[index]
            button.classList.add(stateClasses.isVisible)
        }
    }
    disableFindaCann() {
        const {
            selectors,
            stateClasses,
        } = this
        const findCannButtons = document.querySelectorAll(selectors.findaCannButton)

        for (let index = 0; index < findCannButtons.length; index++) {
            const button = findCannButtons[index]
            button.classList.remove(stateClasses.isVisible)
        }
    }

    disableProductForm() {
        const { selectors } = this
        const forms = document.querySelectorAll(selectors.productForm)

        for (let index = 0; index < forms.length; index++) {
            const form = forms[index]
            form.style.display = 'none'
        }
    }

    enableProductForm() {
        const { selectors } = this
        const forms = document.querySelectorAll(selectors.productForm)

        for (let index = 0; index < forms.length; index++) {
            const form = forms[index]
            form.style.display = 'flex'
        }
    }

    async fetchProductInformation(zipCode, retryCount = 0, updateProductsInfo = true) {
        const {
            LIST_PRODUCTS_ENDPOINT,
        } = this
        zipCode = zipCode || localStorage.getItem('ZIP_CODE')
        if (!zipCode) {
            return
        }
        console.log("Getting LIST_PRODUCTS_ENDPOINT from Grassdoor...")
        await this.axios.get(
            LIST_PRODUCTS_ENDPOINT,
            {
                timeout: 10000,
                headers: {
                    zip_code: zipCode,
                },
            },
        )
            .then(response => {
                const grassdoorProducts = this.extractListOfProductsFromCategories(response.data.data.categories)

                if (updateProductsInfo) this.updateProductInformation(grassdoorProducts)
                this.applyDiscountToPrices()
            })
            .catch(error => {
                // Retry update the products based on GD information if error
                console.log("LIST_PRODUCTS_ENDPOINT getting error: " + error + ". Retrying fetchProductInformation()")
                if (retryCount < 2) {
                    console.log(" Retrying... (Retry Count: " + (retryCount + 1) + ")")
                    this.fetchProductInformation(zipCode, retryCount + 1)
                }
            });
    }

    extractListOfProductsFromCategories(categories) {
        const products = []
        for (let i = 0, total = categories.length; i < total; i++) {
            products.push.apply(
                products,
                categories[i].products,
            )
        }
        window.grassdoorProducts = products
        return products
    }

    async runViewed(productId) {
        alert(1);
    }

    showOutOfStock() {
        if (document.querySelector(".out-of-stock")) return;

        // add label out of stock
        const referenceNode = document.getElementById('product-title');
        const para = document.createElement("p");
        const node = document.createTextNode("Out of Stock");
        para.appendChild(node);
        para.classList.add(
            'out-of-stock',
            'mb-6',
            'font-gotham-condensed',
            'lg:text-left',
            'text-center'
        );

        referenceNode.parentNode.insertBefore(para, referenceNode.nextSibling);

        // hide add to cart form
        document.querySelector('[data-track-viewed-product]').style.display = 'none';
        document.querySelector('.location_detect').style.display = 'none';
        document.querySelector('[data-js-find-a-cann]').style.display = 'none';

        // show email capture and may also like
        document.getElementById('email-capture').style.display = 'block';
        document.getElementById('you-may-also').style.display = 'block';

    }

    updateProductInformation(grassdoorProducts) {
        console.log("updateProductInformation started")
        const {
            selectors,
            stateClasses,
        } = this


        const viewedproducts = document.querySelectorAll(selectors.viewedProduct)
        for (let i = 0, total = viewedproducts.length; i < total; i++) {
            const product = viewedproducts[i]
            const productCta = product.querySelector(selectors.productCta)
            const grassdoorId = parseInt(productCta.dataset.id, 10)
            let grassdoorProductData = grassdoorProducts.find(item => item.mappingId === grassdoorId)
            grassdoorCart.trackProductViewed(grassdoorProductData)

        }

        const products = document.querySelectorAll(selectors.product)

        for (let i = 0, total = products.length; i < total; i++) {
            const product = products[i]
            const productCta = product.querySelector(selectors.productCta)
            const grassdoorId = parseInt(productCta.dataset.id, 10)
            const grassdoorIsBundle = parseInt(productCta.dataset.isBundle, 10)

            let grassdoorProductData = grassdoorProducts.find(item => item.mappingId === grassdoorId)

            if (grassdoorIsBundle === 1) {
                grassdoorProductData = grassdoorProducts.find(
                    item => item.mappingId === grassdoorId && item.type === 'bundle'
                )
            }

            const productCtaText = productCta.querySelector(selectors.productCtaText)
            const productPriceContainer = productCta.querySelector(selectors.productPrice)

            const isSoldOut = grassdoorProductData ? grassdoorProductData.isSoldOut : true
            productCta.classList.remove(stateClasses.loading)
            if (!grassdoorProductData
                || (sessionStorage.getItem('location_availability') === 'false' && !document.querySelectorAll('[data-js-find-a-cann]').length)
            ) {
                productCtaText.textContent = this.cta.title

                productCta.addEventListener('click', (e) => {
                    e.preventDefault()
                    window.location.href = this.cta.url
                })

                continue
            } else if (isSoldOut) {
                if (document.getElementById('product-title').dataset.productSlug === grassdoorProductData.slug) {
                    this.showOutOfStock();
                }
                productCtaText.textContent = 'Shop All'

                productCta.addEventListener('click', (e) => {
                    e.preventDefault()
                    window.location.href = this.soldOutLink
                })

                continue
            } else if (!$('body').hasClass('single-products')) {

                $(productCta).removeAttr('data-id');
                productCtaText.textContent = "Shop now"

                productCta.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = $(productCta).data('link');
                })

                continue
            }


            if (productPriceContainer) {
                productPriceContainer.textContent = `${grassdoorProductData.currency}${grassdoorProductData.salePrice}`
            }
        }
    }

    async initializeGrassdoorCart(zipCode) {

        const {
            selectors,
            API_KEY,
            CART_ENDPOINT,
            CHECKOUT_URL,
        } = this

        let zipcode = zipCode
        if (!zipCode) {
            zipcode = localStorage.getItem('ZIP_CODE')
        }


        const config = {
            id: selectors.cart,
            x_api_key: API_KEY,
            url: CART_ENDPOINT,
            checkoutUrl: CHECKOUT_URL,
            BRANCH_IO_KEY: 'key_live_nm4iICkI02CK683h6LZN1pmazzaxrM9o'
        }

        if (typeof grassdoorCart === 'undefined') {
            return
        }


        grassdoorCart.setDeliveryDetails({postcode: zipcode}, 2)
        // grassdoorCart.setAgeConfirmation(true)

        try {
            grassdoorCart.initialize(config)
        } catch (error) {
            console.log("initializeGrassdoorCart error: " + error);
        }

        const triggers = document.querySelectorAll(selectors.cartTrigger)

        if (!triggers) {
            return
        }
        this.updateCart()
        for (let i=0; i<triggers.length;i++) {

            const showCartTrigger=triggers[i]

            showCartTrigger.onclick=async()=> {
                this.updateCart()
                await grassdoorCart.showCart()
                if (document.querySelector('megamenu-component.active')) {
                    document.querySelector('body.megamenu--open').classList.toggle('megamenu--open')
                    document.querySelector('megamenu-component.active').classList.toggle('active')
                }
            }
        }


        const products = document.querySelectorAll(selectors.product)

        for (let i = 0, total = products.length; i < total; i++) {
            const product = products[i]
            const grassdoorId = parseInt(product.dataset.id, 10)
            product.onclick = async (e) => {
                let grassdoorProductData = window.grassdoorProducts.find(item => item.mappingId === grassdoorId)
                grassdoorCart.trackProductClicked(grassdoorProductData);
            }

        }


        const ctas = document.querySelectorAll(selectors.productCta)

        for (let i = 0, total = ctas.length; i < total; i++) {
            const cta = ctas[i]

            const grassdoorId = parseInt(cta.dataset.id, 10)
            const grassdoorIsBundle = parseInt(cta.dataset.isBundle, 10)

            if (!grassdoorId) {
                continue
            }

            if ($('body').hasClass('single-products')) {
                cta.onclick = async (e) => {

                    e.preventDefault()//This is so that the page does not refresh

                    let grassdoorProductData = window.grassdoorProducts.find(item => item.mappingId === grassdoorId)

                    if (grassdoorIsBundle === 1) {
                        grassdoorProductData = window.grassdoorProducts.find(
                            item => item.mappingId === grassdoorId && item.type === 'bundle'
                        )
                    }

                    const quantityProduct= document.querySelector(selectors.quantityProducts)

                    if(!quantityProduct) {
                        await grassdoorCart.addProductToCart(grassdoorProductData).then((res)=>{
                            if(!res.status) {
                                console.log("initializeGrassdoorCart: Can't get res from function grassdoorCart.addProductToCart");
                                grassdoorCart.updateProductCount(grassdoorProductData.mappingId,1)
                            }
                            this.updateCart()
                            grassdoorCart.showCart()
                        })

                    } else {
                        await grassdoorCart.addProductToCart(grassdoorProductData).then((res)=>{

                            if(res.status) {
                                for(let i=0;i<quantityProduct.value-1;i++) {
                                    grassdoorCart.updateProductCount(grassdoorProductData.mappingId,1)
                                }
                            } else {
                                console.log("initializeGrassdoorCart: Can't get res from function grassdoorCart.addProductToCart");
                                for(let i=0;i<quantityProduct.value;i++) {
                                    grassdoorCart.updateProductCount(grassdoorProductData.mappingId,1)
                                }
                            }
                            this.updateCart()
                            grassdoorCart.showCart()
                        })
                    }
                }
            }

        }

    }
    updateCart() {

        const {selectors}=this

        const cartCount=document.querySelectorAll(selectors.counterProducts)
        let count=grassdoorCart.getCartCount()
        for(let i=0;i<cartCount.length;i++){
            const cartC=cartCount[i]
            cartC.innerHTML= count ? parseInt(count):0
        }
    }

    applyDiscountToPrices() {
        const {
            selectors,
        } = this

        const discountCode = JSON.parse(window.localStorage.getItem('PROMO_REPO'))

        if (!discountCode) {
            return
        }

        for(let i = 0; i < window.grassdoorProducts.length; i++) {
            const product = window.grassdoorProducts[i]

            let discountedPrice = null
            let isDiscounted = false
            let isBundle = product.type === "bundle"

            if (discountCode.type == 1) {
                discountedPrice = (product.salePrice * (1 - (discountCode.discount / 100))).toFixed(2)

                isDiscounted = true
            } else if (discountCode.type == 2) {
                // discount only for "product_ids" if "coupon_type" = 4
                if (discountCode.coupon_type == 4 && !(discountCode.product_ids.includes(product.id))) {
                    continue
                }

                discountedPrice = (product.salePrice * (1 - (discountCode.discount / 100))).toFixed(2)

                isDiscounted = true
            }

            if (isDiscounted) {
                let elementSelector = `${selectors.product}[data-id="${product.mappingId}"]`

                if (isBundle) {
                    elementSelector += '[data-is-bundle="1"]'
                }

                const productElements = document.querySelectorAll(elementSelector)

                for (let i = 0, total = productElements.length; i < total; i++) {
                    const productElement = productElements[i]

                    const productPriceContainer = productElement.querySelector(selectors.productPrice)

                    if (productPriceContainer) {
                        productPriceContainer.innerHTML = `<span class="discounted-price">${product.currency}${product.salePrice}</span> ${product.currency}${discountedPrice}`
                    }
                }
            }
        }
    }
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePhone = (phone) => {
    return phone.match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    );
};

// Update GD email
function updateGDEmail(email) {
    if (!window.localStorage.getItem('ajs_user_traits') && validateEmail(email)) {
        grassdoorCart.attachEmail(email)
        return
    }
    const userTraits = JSON.parse(window.localStorage.getItem('ajs_user_traits'))
    if (userTraits && userTraits.email && validateEmail(userTraits.email)) {
        if (validateEmail(userTraits.email) && validateEmail(email)) {
            grassdoorCart.updateEmail(userTraits.email, email)
            return
        }
    }
    // createAnonymousEmail if ajs_user_traits absent or incorrect email
    var anonymousEmail = grassdoorCart.createAnonymousEmail()
    grassdoorCart.attachEmail(anonymousEmail, true)
}

// Update GD phone
function updateGDPhone(phone) {
    if (!window.localStorage.getItem('ajs_user_traits')) {
        if (validatePhone(phone)) {
            var anonymousEmail = grassdoorCart.createAnonymousEmail()
            grassdoorCart.attachEmail(anonymousEmail, true)
            grassdoorCart.updateEmail(anonymousEmail, anonymousEmail, phone)
            return
        }
    }
    const userTraits = JSON.parse(window.localStorage.getItem('ajs_user_traits'))
    if (userTraits && userTraits.email && validateEmail(userTraits.email)) {
        if (validateEmail(userTraits.email) && validatePhone(phone)) {
            grassdoorCart.updateEmail(userTraits.email, userTraits.email, phone)
        }
    }
    return
}

function juUpdatePhone() {
    try {
        if (document.querySelectorAll('[id^=ju_iframe_]')) {
            var frameContents = $("[id^=ju_iframe_]").contents()
            var juPhone = frameContents.find('input.design-layer-editable[name="phone_number"]')[0].value
            if (frameContents.find('input.design-layer-editable[name="phone_number"]')[0].value) {
                updateGDPhone(juPhone)
            }
        }
    } catch (error) {
        return
    }
}

function juUpdateMail() {
    try {
        if (document.querySelectorAll('[id^=ju_iframe_]')) {
            var frameContents = $("[id^=ju_iframe_]").contents()
            var juEmail = frameContents.find('input.design-layer-editable[name="email"]')[0].value;
            if (frameContents.find('input.design-layer-editable[name="email"]')[0].value) {
                updateGDEmail(juEmail)
            }
        }
    } catch (error) {
        return
    }
}

// Find JustUno pop up
var juTicks = 0;
let juTimerId = setTimeout(function findJUPopupTick() {
    juTicks++;
    if (document.querySelectorAll('[id^=ju_iframe_]').length > 0) {
        if (
            $("[id^=ju_iframe_]").contents().find('[name="newsletter_submit"]') &&
            $("[id^=ju_iframe_]").contents().find('[name="newsletter_submit"]').length === 1
        ) {
            $("[id^=ju_iframe_]").contents().find('[name="newsletter_submit"]')[0].addEventListener('click', juUpdatePhone);
            //turn off timer
            clearInterval(juTimerId);
            return
        }
        if (
            $("[id^=ju_iframe_]").contents().find('[name="submit"]') &&
            $("[id^=ju_iframe_]").contents().find('[name="submit"]').length === 1
        ) {
            $("[id^=ju_iframe_]").contents().find('[name="submit"]')[0].addEventListener('click', juUpdateMail);
            //turn off timer
            clearInterval(juTimerId);
            return
        }
        
    }
    // Turn off timer if 1 minute has passed
    if (juTicks > 30) {
        clearInterval(juTimerId);
        return
    }
    juTimerId = setTimeout(findJUPopupTick, 2000);
}, 2000);

// Find needsclick first button (email pop up)
var needsEmailTicks = 0;
let needsEmailTimerId = setTimeout(function findNCPopupEmailTick() {
    needsEmailTicks++;
    if (document.querySelector('input[aria-label="Email"]')) {
        $('button[class^="needsclick go"]').on( "click", function() {
            updateGDEmail($('input[aria-label="Email"]')[0].value);
        })
        //turn off timer
        clearInterval(needsEmailTimerId);
        return
    }
    // Turn off timer if 5 minutes has passed
    if (needsEmailTicks > 150) {
        clearInterval(needsEmailTimerId);
        return
    }
    needsEmailTimerId = setTimeout(findNCPopupEmailTick, 2000);
}, 2000);

// Find needsclick second (phone) pop up
var needsPhoneTicks = 0;
let needsPhoneTimerId = setTimeout(function findNCPopupPhoneTick() {
    needsPhoneTicks++;
    if (document.querySelector('input[aria-label="Phone Number"]')) {
        $('button[class^="needsclick go"]').on( "click", function() {
            updateGDPhone($('input[aria-label="Phone Number"]')[0].value);
        })
        //turn off timer
        clearInterval(needsPhoneTimerId);
        return
    }
    // Turn off timer if 5 minutes has passed
    if (needsPhoneTicks > 150) {
        clearInterval(needsPhoneTimerId);
        return
    }
    needsPhoneTimerId = setTimeout(findNCPopupPhoneTick, 2000);
}, 2000);
