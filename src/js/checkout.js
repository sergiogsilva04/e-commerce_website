$(document).ready(function () {
    $.getJSON("../js/countries.json", function (countries) {
        const countrySelect = $('#country')[0];

        countrySelect.innerHTML = '<option value="" selected>Selecione um país</option>';

        for (let country in countries) {
            let option = document.createElement('option');

            option.value = country;
            option.text = country;

            countrySelect.add(option);
        }
    });

    $('#country').on('change', populateCities);

    const translateCategory = {
        "products": "Produtos",
        "services": "Serviços",
        "partners": "Parceiros"
    }

    const shoppingCart = $("#shoppingCart")[0];

    shoppingCart.innerHTML = `
        <div class="list-group-item d-flex justify-content-between mt-5 border-2 rounded-2 align-items-center">
            <form>
                <div class="form-group">
                    <label>Tens algum código de desconto?</label>

                    <div class="input-group mt-2">
                        <input type="text" class="form-control me-2 rounded-2" name="coupon"
                            placeholder="Código de desconto">

                        <span class="input-group-append">
                            <button id="applyCouponButton"
                                class="btn btn-primary btn-apply coupon">Aplicar</button>
                        </span>
                    </div>
                </div>
            </form>
        </div>

        <div
            class="list-group-item d-flex justify-content-between mt-2 border-2 rounded-2 align-items-center">
            <h6 class="fs-5 mb-0 fw-bold">Total</h6>
            <span id="totalPriceText" class="fs-4"></span>
        </div>
    `;

    const shoppingCartItems = getShoppingCart();

    shoppingCartItems.forEach(item => {
        shoppingCart.innerHTML = `
            <li class="list-group-item d-flex justify-content-between">
               <div class="me-2">
                    <h6>${item.name}</h6>
                    <span class="text-muted">${translateCategory[item.category]}</span>

                    <br>
                    <label class="form-label" for="quantity-${item.id}" style="display: inline-block;">Qnt.:</label>
                    <input min="1" value="1" type="number" id="quantity-${item.id}" class="quantity-input form-control d-inline-block ms-2" />
                </div>

                <span class="item-price text-muted">${item.price}€</span>
            </li>
        ` + shoppingCart.innerHTML;
    });

    $('#totalItemsText').text(shoppingCartItems.length);

    updateTotalPrice();

    const quantityInputs = document.querySelectorAll('.quantity-input');
    const priceSpans = document.querySelectorAll('.item-price');

    quantityInputs.forEach(function (quantityInput, index) {
        quantityInput.addEventListener('input', function () {
            const item = getItemById(quantityInput.id.replace('quantity-', ''));
            const quantity = parseInt(quantityInput.value);

            priceSpans[index].textContent = `${isNaN(quantity) ? '0' : quantity * parseFloat(item.price)}€`

            updateTotalPrice();
        });
    });
});

function updateTotalPrice() {
    let totalPrice = 0;

    $("#shoppingCart")[0].querySelectorAll(".item-price").forEach(priceElement => totalPrice += parseFloat(priceElement.innerHTML));

    $("#totalPriceText").text(`${isNaN(totalPrice) ? '0' : totalPrice}€`);
}

function getShoppingCart() {
    const cart = localStorage.getItem('shoppingCart');

    return cart ? JSON.parse(cart) : [];
}

function getItemById(itemId) {
    const cart = localStorage.getItem('shoppingCart');

    if (!cart) return;

    return JSON.parse(cart).find(item => item.id === itemId);
}

function populateCities() {
    const countrySelect = $('#country')[0];
    const citySelect = $('#city')[0];

    $.getJSON("../js/countries.json", function (countries) {
        citySelect.innerHTML = '<option value="" selected>Selecione uma cidade</option>';

        if (countrySelect.value in countries) {
            citySelect.disabled = false;

            const cities = countries[countrySelect.value];

            for (let i = 0; i < cities.length; i++) {
                let option = document.createElement('option');

                option.value = cities[i];
                option.text = cities[i];

                citySelect.add(option);
            }
        }
    });
}