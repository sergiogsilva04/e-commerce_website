loadData(window.location.search.substring(1))

async function loadData(itemId) {
    $.getJSON("../js/shop-data.json", function (data) {
        let item = null;

        for (const category in data) {
            data[category].forEach(shopItem => {
                if (shopItem.id === itemId) {
                    item = shopItem;

                    return;
                }
            });
        }

        if (!item) {
            window.location.href = "404.html";

            return;
        }

        const translateCategory = {
            "products": "Produtos",
            "services": "Serviços",
            "partners": "Parceiros"
        }

        $(".image-col")[0].innerHTML = `<img class="w-75" src="../assets/shop-images/${item.category}/${item.image}" alt="${item.name}">`;

        $("#itemName").html(item.name);
        $("#itemCategory").html(translateCategory[item.category]);
        $("#itemId").html(`Código: ${item.id}`);
        $("#itemPrice").html(`${item.price}€`);
        $("#itemDescription").html(item.description);
        $("#itemStock").html(`<b>Quantidade disponível:</b> ${item.stock}`);

        for (let i = 0; i < item.stars; i++) {
            $('.star-filter')[i].classList.add('star-checked');
        }

        if (isItemInShoppingCart(item)) {
            $("#addToCartButton")[0].hidden = true;
            $("#alreadyAddedItem")[0].hidden = false;

        } else if (window.location.search) {
            $("#addToCartButton")[0].hidden = false;
            $("#alreadyAddedItem")[0].hidden = true;
        }

        if (item.stock <= 0) {
            $("#addToCartButton")[0].hidden = true;
            $("#alreadyAddedItem")[0].hidden = false;
            $("#alreadyAddedItem")[0].innerHTML = "Stock indisponível"
        }
    });
} 