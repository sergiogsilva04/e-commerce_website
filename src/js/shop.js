$(document).ready(function () {
    $("#shoppingCartButton").on("click", function () {
        $(".shopping-cart")[0].hidden = !$(".shopping-cart")[0].hasAttribute("hidden");
    });

    if (window.location.pathname.includes("index")) {
        loadShop(window.location.hash.substring(1));

        history.pushState("", document.title, window.location.pathname + window.location.search);

    } else if (!window.location.search) {
        loadShop();
    }

    $("#checkoutButton").on("click", async function () {
        window.location.href = "../src/pages/checkout.html";
    });

    $(".shop-menu li").on("click", function () {
        $("html, body").animate({ scrollTop: $("#shop").offset().top - 70 }, 200);

        loadShop($(this).attr("data-id"));
    });

    $(".change-shop-category a").on("click", function () {
        $("html, body").animate({ scrollTop: $("#shop").offset().top - 70 }, 200);

        loadShop($(this).attr("data-id"));
    });

    if (window.location.search) {
        $("#addToCartButton")[0].hidden = false;
        $("#alreadyAddedItem")[0].hidden = true;
    }

    if (getShoppingCart().length > 0) {
        loadShoppingCart();
    }
});

function loadShop(category) {
    $.getJSON("./js/shop-data.json", function (data) {
        const shopGallery = $(".shop-gallery")[0];

        $(".shop-menu li").siblings().removeClass("shop-active");

        switch (category) {
            case "services":
                $(".shop-menu li")[1].classList.add("shop-active");
                data = data.services;

                break;

            case "partners":
                $(".shop-menu li")[2].classList.add("shop-active");
                data = data.partners;

                break;

            default:
                category = "products";
                data = data.products;

                $(".shop-menu li")[0].classList.add("shop-active");

                break;
        }

        let htmlData = "";

        data.forEach(item => {
            let button = isItemInShoppingCart(item) ?
                `<button type="button" class="disabled btn btn-secondary w-50 rounded-5 text-white fs-6 mt-2 p-2 border-0" onclick="event.preventDefault(); addItemToShoppingCart('${item.id}');">Item adicionado</button>`
                :
                `<button type="button" class="btn btn-secondary w-50 rounded-5 text-white fs-6 mt-2 p-2 border-0" onclick="event.preventDefault(); addItemToShoppingCart('${item.id}');">Adicionar</button>`;
            

            htmlData += `
                <div data-id="${item.id}" style="min-width: 300px; max-width: 300px;" class="d-flex flex-column justify-content-center align-items-center content m-3 p-3 text-center rounded-4">
                    <img class="mb-3" style="width: 150px; height: 80px;" src="./assets/shop-images/${category}/${item.image}">
                    <a href="./pages/product-info.html?${item.id}" class="text-dark text-decoration-none fw-bold mt-2 fs-5">${item.name}</a>
                    
                    ${item.stock > 0 ?
                        `<p style="background: #70d99e" class="p-2 rounded-3 mt-2"><i class="fa fa-check"></i> Disponível</p>`
                        :
                        `<p style="background: #ff6b6b" class="p-2 rounded-3 mt-2"><i class="fa fa-x"></i> Esgotado</p>`
                    }

                    <h6 class="fs-3 mt-2">${item.price}€</h6>
                    
                    ${item.stock > 0 ? button : ""}
                </div>
            `;
        });

        shopGallery.innerHTML = htmlData;
    });
}

async function addItemToShoppingCart(item) {
    if (!item) return;

    if (!item.id) {
        item = await getItemById(item);
    }

    let cart = await getShoppingCart();
    cart.push(item);

    updateShoppingCart(cart);

    const shoppingCart = $(".shopping-cart .items")[0];

    shoppingCart.innerHTML = `
        <div class="box p-2 m-2 gap-4 rounded-4 justify-content-between align-items-center">
            <img class="w-25" src="${window.location.search ? "../" : "./"}assets/shop-images/${item.category}/${item.image}" alt="${item.name}">

            <div>
                <h3 class="fs-5">${item.name}</h3>
                <span class="fs-4 price">${item.price}€</span>
            </div>

            <button onclick="removeItemFromShoppingCart(this, '${item.id}')" type="button" title="Remover"
                class="btn btn-danger h-100"><i class="fa fa-trash"></i></button>
        </div>
    ` + shoppingCart.innerHTML;

    let totalPrice = 0;

    shoppingCart.querySelectorAll(".price").forEach(priceElement => totalPrice += parseFloat(priceElement.innerHTML));

    $(".shopping-cart")[0].querySelector("#totalPriceText").innerHTML = `Total: ${totalPrice}€`;
    $(".shopping-cart")[0].querySelector("#checkoutButton").hidden = false;

    if (item.id === window.location.search.substring(1)) {
        $("#addToCartButton")[0].hidden = true;
        $("#alreadyAddedItem")[0].hidden = false;

    } else if (window.location.search) {
        $("#addToCartButton")[0].hidden = false;
        $("#alreadyAddedItem")[0].hidden = true;
    }

    if (!window.location.search) {
        $(".shop-gallery")[0].querySelector(`[data-id="${item.id}"] button`).classList.add("disabled");
        $(".shop-gallery")[0].querySelector(`[data-id="${item.id}"] button`).innerHTML = "Item adicionado";
    }
}

async function removeItemFromShoppingCart(item, itemId) {
    item.parentNode.remove();

    const shoppingCart = $(".shopping-cart .items")[0];
    let totalPrice = 0;

    shoppingCart.querySelectorAll(".price").forEach(priceElement => totalPrice += parseFloat(priceElement.innerHTML));

    if (totalPrice === 0) {
        $(".shopping-cart")[0].querySelector("#totalPriceText").innerHTML = "Sem produtos";
        $(".shopping-cart")[0].querySelector("#checkoutButton").hidden = true;

    } else {
        $(".shopping-cart")[0].querySelector("#totalPriceText").innerHTML = `Total: ${totalPrice}€`;
    }

    if (!window.location.search) {
        $(".shop-gallery")[0].querySelector(`[data-id="${itemId}"] button`).classList.remove("disabled");
        $(".shop-gallery")[0].querySelector(`[data-id="${itemId}"] button`).innerHTML = "Adicionar";
    }

    const cartItems = getShoppingCart();
    const itemIndex = cartItems.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);

        updateShoppingCart(cartItems);

        if (itemId === window.location.search.substring(1)) {
            $("#addToCartButton")[0].hidden = false;
            $("#alreadyAddedItem")[0].hidden = true;
        }

        console.log(`${itemId} removed from the shopping cart.`);
    }
}

async function getItemById(itemId) {
    const data = await $.getJSON(`${window.location.search ? "../" : "./"}js/shop-data.json`);

    let returnItem;

    for (const category in data) {
        data[category].forEach(item => {
            if (item.id === itemId) {
                returnItem = item;

                return;
            }
        });
    }

    return returnItem;
}

function getShoppingCart() {
    const cart = localStorage.getItem("shoppingCart");

    return cart ? JSON.parse(cart) : [];
}

function updateShoppingCart(cartItems) {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

    console.log("shopping cart updated")
}

function loadShoppingCart() {
    const shoppingCart = $(".shopping-cart .items")[0];

    getShoppingCart().forEach(item => {
        shoppingCart.innerHTML = `
            <div class="box p-2 m-2 gap-4 rounded-4 justify-content-between align-items-center">
                <img class="w-25" src="${window.location.search ? "../" : "./"}assets/shop-images/${item.category}/${item.image}" alt="${item.name}">

                <div>
                    <h3 class="fs-5">${item.name}</h3>
                    <span class="fs-4 price">${item.price}€</span>
                </div>

                <button onclick="removeItemFromShoppingCart(this, '${item.id}')" type="button" title="Remover"
                    class="btn btn-danger h-100"><i class="fa fa-trash"></i></button>
            </div>
        ` + shoppingCart.innerHTML;
    });

    let totalPrice = 0;

    shoppingCart.querySelectorAll(".price").forEach(priceElement => totalPrice += parseFloat(priceElement.innerHTML));

    $(".shopping-cart")[0].querySelector("#totalPriceText").innerHTML = `Total: ${totalPrice}€`;
    $(".shopping-cart")[0].querySelector("#checkoutButton").hidden = false;
}

function isItemInShoppingCart(item) {
    let isItemInShoppingCart = false;

    getShoppingCart().forEach(cartItem => {
        if (cartItem.id === item.id) {
            isItemInShoppingCart = true;
        }
    });

    return isItemInShoppingCart;
}