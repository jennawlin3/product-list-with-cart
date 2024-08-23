const d = document;
const $productsContainer = document.querySelector("#products-container");
const $productTemplate = document.getElementById("product-grid").content.cloneNode(true);
let itemVal = 1;
let currentProduct = 0;
let cart = {};
let bill = {};
let totalProducts = {};

async function loadProducts() {

        await fetch("./data.json")
        .then(response => response.json())
        .then(data => showInfo(data));
    
        function showInfo(data) {
        data.forEach((d,index) => {
        // Card
        const $productCard = document.createElement("div");
        $productCard.classList.add("product-card");
        $productCard.setAttribute("id", index+1)

        const $productImgContainer = document.createElement("div");
        $productImgContainer.classList.add("product-img_container");

        //Picture
        const $pictureContainer = document.createElement("picture");
        $pictureContainer.classList.add("product-img");
        const $productPic = document.createElement("img");
        $productPic.classList.add("product-pic");
        $productPic.setAttribute("src", d.image.mobile);

        $pictureContainer.appendChild($productPic);
        $productImgContainer.appendChild($pictureContainer);

        //Buttons
        const $buttonsContainer = document.createElement("div");
        $buttonsContainer.classList.add("buttons-container");

        // Cart Button
        const $cartBtn = document.createElement("button");
        $cartBtn.classList.add("cart-btn");
        $cartBtn.textContent = "Add to Cart"
        const $cartIcon = document.createElement("img");
        $cartIcon.setAttribute("src", "./assets/images/icon-add-to-cart.svg");
        $cartIcon.setAttribute("alt", "Cart Icon");
        $cartBtn.setAttribute("data-id", index+1);
        $cartBtn.appendChild($cartIcon);

        // Add Remove Buttons
        const $addRemoveBtn = document.createElement("button");
        $addRemoveBtn.classList.add("add-remove_btn");
        $addRemoveBtn.classList.add("hide");

        // Decrement Button
        const $decrementBtn = document.createElement("span");
        $decrementBtn.classList.add("remove-btn");
        const $decrementIcon = document.createElement("img");
        $decrementIcon.setAttribute("src", "./assets/images/icon-decrement-quantity.svg");
        $decrementIcon.setAttribute("alt", "Decrement Icon");

        $decrementBtn.appendChild($decrementIcon);

        // Item Count
        const $numberProduct = document.createElement("span");
        $numberProduct.classList.add("number-products");
        $numberProduct.textContent = itemVal;

        // Increment Button
        const $incrementBtn = document.createElement("span");
        $incrementBtn.classList.add("add-btn");
        const $incrementIcon = document.createElement("img");
        $incrementIcon.setAttribute("src", "./assets/images/icon-increment-quantity.svg");
        $cartIcon.setAttribute("alt", "Increment Icon");
        $incrementBtn.appendChild($incrementIcon);

        $addRemoveBtn.appendChild($decrementBtn);
        $addRemoveBtn.appendChild($numberProduct);
        $addRemoveBtn.appendChild($incrementBtn);

        $buttonsContainer.appendChild($addRemoveBtn);
        $buttonsContainer.appendChild($cartBtn);

        $productImgContainer.appendChild($buttonsContainer);

        // Product info container
        const $productInfo = document.createElement("div");
        $productInfo.classList.add("product-info");

        // Category
        const $category = document.createElement("p");
        $category.classList.add("category");
        $category.textContent = d.category;

        //Product Name
        const $productName = document.createElement("h2");
        $productName.classList.add("product-name");
        $productName.textContent = d.name;

        // Price 
        const $price = document.createElement("p");
        $price.classList.add("price");
        let price = d.price.toString();
        if(price.length < 4) {
            if(price.includes(".")) {
                let newPrice = price.padEnd(4, "0");            
                $price.textContent = "$" + newPrice;
            }
            if(!price.includes(".")) {
                let newPrice = price + ".00";            
            $price.textContent = "$" + newPrice;               
            }
        }

        $productInfo.appendChild($category);
        $productInfo.appendChild($productName);
        $productInfo.appendChild($price);
        $productCard.appendChild($productImgContainer);
        $productCard.appendChild($productInfo);

        $productsContainer.appendChild($productCard);
            })
        }

        addFunctionality();
        addRemove();
}

document.addEventListener("DOMContentLoaded", loadProducts())

// Buttons

function addFunctionality() {
    const cartBtns = document.querySelectorAll(".cart-btn");
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const productPic = document.querySelectorAll(".product-pic")

    cartBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            currentProduct = parseInt(e.currentTarget.dataset.id);

            e.currentTarget.classList.add("hide");
            addRemoveBtn[currentProduct-1].classList.remove("hide");
            productPic[currentProduct-1].style.border = "3px solid var(--red)"
    })

    })
}    


// Add/Remove Buttons
function addRemove() {
const $addBtns = document.querySelectorAll(".add-btn");
const $removeBtns = document.querySelectorAll(".remove-btn");
const $numberProducts = document.querySelectorAll(".number-products");
const $productName = document.querySelectorAll(".product-name");
const $productPrice = document.querySelectorAll(".price");

let itemCount;

 $addBtns.forEach((addBtn, index) => {
    addBtn.addEventListener("click", e => {
        if(e) {
        incrementItems(index);
        }
    })
 })

 $removeBtns.forEach((removeBtn,index) => {
    removeBtn.addEventListener("click", e => {
        if(e) {
            decrementItems(index);
        }
    })
 })

 function incrementItems(index) {
    itemCount =parseInt($numberProducts[index].textContent);
    itemCount++;
    $numberProducts[index].textContent = itemCount;


    if(!cart[index]) {
        cart[index] = {
            id: index,
            name: $productName[index].textContent,
            items: itemCount,
            price1: Number(($productPrice[index].textContent).replace("$", "")),           
            price2: Number(($productPrice[index].textContent).replace("$", ""))*itemCount,
        };
    } else {
        cart[index] = {
            id: index,
            name: $productName[index].textContent,
            price1: Number(($productPrice[index].textContent).replace("$", "")),            
            price2: Number(($productPrice[index].textContent).replace("$", ""))*itemCount,
            items: itemCount++
        }
    }

    updateCart(cart, increase = true);
 }    
}

function updateCart(cart, option) {
    const CartContainer = document.querySelector(".cart-items_container");
    const orderContainer = document.querySelector(".order-container");
    const numberItemCart = document.querySelector(".number-items");

    const empty = document.querySelector(".empty");

    if(cart !== "") {
        empty.classList.add("hide");
        orderContainer.classList.remove("hide");
    } else {
        empty.classList.remove("hide");
        orderContainer.classList.add("hide");
    }

    const cartItemsContainer = document.querySelector("#cart-items");
    cartItemsContainer.textContent = "";    
    const totalBill = document.querySelector("#total-account");

    if(cart!== undefined) {
    let products = Object.entries(cart);

    products.forEach((item, index) => {

        // Total items in cart
        if(!totalProducts[index]) {
            totalProducts[index] = Number(item[1].items);
        } else {
            totalProducts[index] = Number(item[1].items);
        }

        let sumProducts = Object.values(totalProducts).reduce((acum, cur) => acum + cur);

        numberItemCart.textContent = sumProducts;

        // Total bill
        if(!bill[index]) {
            bill[index] = Number(item[1].price2);
        } else {
            bill[index] = Number(item[1].price2);
        }

        let fullBill = Object.values(bill).reduce((acum, cur) => acum + cur);

        totalBill.textContent = fullBill;



        const cartItems = document.createElement("div");
        cartItems.classList.add("cart-items");

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const itemInfo = document.createElement("div");
        itemInfo.classList.add("item-info");

        const productName = document.createElement("p");
        productName.textContent = item[1].name;
        productName.classList.add("product-name");

        // Item container
        const itemNumber = document.createElement("div");
        itemNumber.classList.add("item-number__container");

        const number = document.createElement("p");
        number.classList.add("number");
        const numberItem = document.createElement("span");
        numberItem.classList.add("number-item");
        numberItem.textContent = item[1].items + "x"

        number.appendChild(numberItem);

        const indPriceContainer = document.createElement("p");
        indPriceContainer.textContent = "$";
        indPriceContainer.classList.add("ind-price_container");
        const indPrice = document.createElement("span");
        indPrice.classList.add("ind-price");
        

        indPrice.textContent = item[1].price1;         
        indPriceContainer.appendChild(indPrice); 

        const totalPriceContainer = document.createElement("p");
        totalPriceContainer.classList.add("total-price_container");
        totalPriceContainer.textContent = "$";
        const totalPrice = document.createElement("span");
        totalPrice.classList.add("total-price");
        let total = String(item[1].price2);
        totalPrice.textContent = item[1].price2;


        const deleteBtnContainer = document.createElement("div");
        deleteBtnContainer.classList.add("delete-btn-container");
        const deleteBtn = document.createElement("button");
        const deleteIcon = document.createElement("img");
        deleteIcon.setAttribute("src", "./assets/images/icon-remove-item.svg");
        deleteIcon.setAttribute("alt", "Delete icon");

        deleteBtn.appendChild(deleteIcon);
        deleteBtnContainer.appendChild(deleteBtn);

        totalPriceContainer.appendChild(totalPrice);

        itemNumber.appendChild(number);
        itemNumber.appendChild(indPriceContainer);
        itemNumber.appendChild(totalPriceContainer);

        itemInfo.appendChild(productName);
        itemInfo.appendChild(itemNumber);

        cartItem.appendChild(itemInfo);
        cartItems.appendChild(cartItem);
        cartItems.appendChild(deleteBtnContainer);

        cartItemsContainer.appendChild(cartItems);
        CartContainer.appendChild(cartItemsContainer);

    }) 
    }
    



}

function decrementItems(index) {

    if(cart[index].items === 0) {
        console.log(cart);
        delete cart[index];
        updateCart(cart);
        return;
    }
    cart[index].items--;
    cart[index].price2 -= cart[index].price1;
    const numberProducts = document.querySelectorAll(".number-products");

    numberProducts[index].textContent = cart[index].items;


    updateCart(cart);
}






