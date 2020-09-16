// const { resolveSoa } = require("dns");

// const { decodeStream } = require("iconv-lite");

window.addEventListener('DOMContentLoaded', () => {

    const   tabs = document.querySelectorAll('.tabheader__item'),
            tabscontent = document.querySelectorAll('.tabcontent'),
            tabsParent = document.querySelector('.tabheader__items');

    
    function hideTabContent() {
        tabscontent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabscontent[i].classList.add('show', 'fade');
        tabscontent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // Timers 

    const deadline = '2020-08-02';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
 
        if (t < 0) {
            return {t: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
        } else {
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }
    }

    function getZero(num) {
        if (num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }


    function setClock(selector, endtime) {
        const   timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const   t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // Modal 

    const modalTriggers = document.querySelectorAll('[data-modal]'),
         modal = document.querySelector('.modal');

    let  wasOpened = false;

    modalTriggers.forEach(btn => {
            btn.addEventListener('click', openModal);
        });


    function openModal() {
        modal.classList.add('show', 'fade');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        wasOpened = true;
    }

    function closeModal() {
        modal.classList.remove('show', 'fade');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight - 1 && wasOpened === false) {
                openModal();
        }
    });

    // Uses classes for menu_item

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `                
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // axious.get('http://localhost:3000/menu')
    //     .then(data => {
    //             data.data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');
    //         price = +price * 27;
    //         element.classList.add('menu__item');

    //         element.innerHTML = `
    //         <img src=${img} alt=${altimg}>
    //         <h3 class="menu__item-subtitle">${title}</h3>
    //         <div class="menu__item-descr">${descr}</div>
    //         <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //         </div>
    //         `;
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

        // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(form => bindPostData(form));

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
                statusMessage.remove();
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    // Sliders

    const   slider = document.querySelector('.offer__slider'),
            slides = slider.querySelectorAll('.offer__slide'),
            prev = slider.querySelector('.offer__slider-prev'),
            next = slider.querySelector('.offer__slider-next'),
            current = slider.querySelector('#current'),
            total = slider.querySelector('#total'), 
            slidesWrapper = document.querySelector('.offer__slider-wrapper'),
            slidesField = document.querySelector('.offer__slider-inner'),
            width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    total.textContent = getZero(slides.length);
    current.textContent = getZero(slideIndex);

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const   indicators = document.createElement('ol'),
            dots = [];
    indicators.classList.add('carousel-indicators');
    
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity =1;
        }
        indicators.append(dot);
        dots.push(dot);
    }



    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        ++slideIndex;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        } 

        if (slideIndex < 1) {
            slideIndex = slides.length;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;

        current.textContent = getZero(slideIndex);
        slidesField.style.transform = `translateX(-${offset}px)`;
    });

    prev.addEventListener('click', () => {
        if (offset == 0){
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        --slideIndex;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        } 

        if (slideIndex < 1) {
            slideIndex = slides.length;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;


        current.textContent = getZero(slideIndex);
        slidesField.style.transform = `translateX(-${offset}px)`;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');
            
            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1)
            slidesField.style.transform = `translateX(-${offset}px)`;

            current.textContent = getZero(slideIndex);
            
            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });
    });
    // showSlides(slideIndex);

    // total.textContent = getZero(slides.length);

    // function showSlides(n=1) {
        // if (n > slides.length) {
        //     slideIndex = 1;
        // } 

        // if (n < 1) {
        //     slideIndex = slides.length;
        // }

    //     current.textContent = getZero(slideIndex);

    //     slides.forEach(item => item.classList.add('hide'));

    //     slides[slideIndex - 1].classList.remove('hide');
    // }

    // prev.addEventListener('click', () => showSlides(--slideIndex));
    // next.addEventListener('click', () => showSlides(++slideIndex));


});