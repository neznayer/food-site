window.addEventListener("DOMContentLoaded", () => {
    // Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    // skryt vse taby (soderzhanie)
    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show", "fade"); // nuzhno udalyat fade chtoby v buduschem animaciya eshe raz vosproizvodilas
        });
        tabs.forEach((tab) => {
            tab.classList.remove("tabheader__item_active");
        });
    }
    // pokazyvat tab pod nomerom i
    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.classList.contains("tabheader__item")) {
            // opredelit nomer taba v kotory clicknuli i vzyat nomer i pokazat tab content pod etim zhe nomerom
            // esli element po kotoromu click sovpadaet s perebiraemym, to eto ni est nash el, i ego nomer i
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadLine = "2021-01-11";

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endTime);
            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if (t <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    setClock(".timer", deadLine);

    // modal

    const modalOpenBtns = document.querySelectorAll("[data-modal]");
    const modalCloseBtn = document.querySelector("[data-close]");

    const modal1 = document.querySelector(".modal");

    modalOpenBtns.forEach((i) => {
        i.addEventListener("click", openModal);
    });

    modalCloseBtn.addEventListener("click", closeModal);

    function openModal() {
        modal1.classList.add("show");
        modal1.classList.remove("hide");
        document.body.style.overflow = "hidden";
        //clearInterval(modalTimerId);
    }

    function closeModal() {
        modal1.classList.add("hide");
        modal1.classList.remove("show");
        document.body.style.overflow = "";
    }

    modal1.addEventListener("click", (e) => {
        if (e.target === modal1) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal1.classList.contains("show")) {
            closeModal();
        }
    });

    // const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }
    window.addEventListener("scroll", showModalByScroll);

    // cards by class

    class Card {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.title = title;
            this.alt = alt;
            this.descr = descr;
            this.price = price;
            this.rate = 60;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.changeToRUR();
        }

        changeToRUR() {
            this.price = this.price * this.rate;
        }

        render() {
            const elem = document.createElement("div");

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                elem.classList.add(this.classes);
            } else {
                this.classes.forEach((className) =>
                    elem.classList.add(className)
                );
            }

            elem.innerHTML = `
            <img src="${this.src}" alt="${this.alt}" />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
                ${this.descr}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total">
                    <span>${this.price}</span> грн/день
                </div>
            </div>
            `;

            this.parent.appendChild(elem);
        }
    }

    // forms
    const forms = document.querySelectorAll("form");

    const message = {
        loading: "loading...",
        success: "success!",
        failure: "failure",
    };

    forms.forEach((item) => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: data,
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            const statusMessage = document.createElement("div");
            statusMessage.classList.add("status");
            statusMessage.textContent = message.loading;

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            form.appendChild(statusMessage);

            postData("http://localhost:3000/requests", json)
                .then((data) => {
                    console.log(data);
                    statusMessage.textContent = message.success;
                    setTimeout(() => statusMessage.remove(), 1000);
                })
                .catch(() => {
                    statusMessage.textContent = message.failure;
                })
                .finally(() => form.reset());
        });
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.ststus}`);
        }
        return await res.json();
    };

    getResource("http://localhost:3000/menu").then((data) => {
        data.forEach(({ img, alt, title, descr, price }) => {
            new Card(
                img,
                alt,
                title,
                descr,
                price,
                ".menu .container"
            ).render();
        });
    });
});

// function sayName(surname) {
//     console.log(this);
//     console.log(this.name + surname);
// }

// const user = {
//     name: "John"
// };

// //sayName.call(user, "Smith");
// sayName.apply(user, ["Smith"]);

// function sayName() {console.log(this.a);}
// const a = {a: 'a'};

// sayName.apply(a);

// class Rectangle {
//     constructor(height, width) {
//         this.height = height;
//         this.width = width;
//     }
//     calcArea() {
//         return this.height * this.width;
//     }
// }

// class ColoredRectWithText extends Rectangle {
//     constructor(height, width, text, bgColor) {
//         super(height, width); // strochki is constructor prototipa, t.e. this.height = height; ....
//         this.text = text;
//         this.bgColor = bgColor;
//     }

//     showMyProps(text, bgColor) {
//         console.log(text, bgColor);
//     }
// }

// const square = new Rectangle(10, 10);
// console.log(square.calcArea());
