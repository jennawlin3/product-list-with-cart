const d = document;
const $productsContainer = document.querySelector("#products-container");
const $productTemplate = document.getElementById("product-grid").content.cloneNode(true);
let itemVal = 1;
let currentProduct = 0;
let cart = {};
let bill = {};
let totalProducts = {};
let update = false;

async function loadProducts() {
    const container = document.querySelector(".container");

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

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.classList.add("hide");
        container.appendChild(overlay);

        addBtnFunctionality();
}

document.addEventListener("DOMContentLoaded", loadProducts())

//Buttons
function addBtnFunctionality() {
    const cartBtns = document.querySelectorAll(".cart-btn");
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const productPic = document.querySelectorAll(".product-pic");
    const confirmBtn = document.querySelector(".confirm-btn");

    cartBtns.forEach((btn, index) => {
        btn.addEventListener("click", e => {
            currentProduct = parseInt(e.currentTarget.dataset.id);

            e.currentTarget.classList.add("hide");
            addRemoveBtn[currentProduct-1].classList.remove("hide");
            productPic[currentProduct-1].style.border = "3px solid var(--red)";
            createCart(index);
    })
})

    confirmBtn.addEventListener("click", e => {
        if(e) {
            showOrderCard();
        }
    })

const $addBtns = document.querySelectorAll(".add-btn");
const $removeBtns = document.querySelectorAll(".remove-btn");
const $numberProducts = document.querySelectorAll(".number-products");
const $productName = document.querySelectorAll(".product-name");
const $productPrice = document.querySelectorAll(".price");
const $iconAddBtn = document.querySelectorAll(".add-btn img");
const $iconRemoveBtn = document.querySelectorAll(".remove-btn img");
const $productPic = document.querySelectorAll(".product-pic");

let itemCount;

 $addBtns.forEach((addBtn, index) => {
    addBtn.addEventListener("click", e => {
        if(e) {
        incrementItems(index);
        }
    })
    addBtn.addEventListener("mouseover", e => {
    $iconAddBtn[index].setAttribute("src", "./assets/images/icon-increment-quantity1.svg");
    })
    addBtn.addEventListener("mouseout", e => {
        $iconAddBtn[index].setAttribute("src", "./assets/images/icon-increment-quantity.svg");
    })
 })

 $removeBtns.forEach((removeBtn,index) => {
    removeBtn.addEventListener("click", e => {
        if(e) {
            decrementItems(index);
        }
    })
    removeBtn.addEventListener("mouseover", e => {
        $iconRemoveBtn[index].setAttribute("src", "./assets/images/icon-decrement-quantity1.svg");
        })
        removeBtn.addEventListener("mouseout", e => {
            $iconRemoveBtn[index].setAttribute("src", "./assets/images/icon-decrement-quantity.svg");
        })
})

 function createCart(index) {
    const numberProducts = document.querySelectorAll(".number-products");

    if(!cart[index]) {
        cart[index] = {
            id: index,
            img: $productPic[index].src,
            name: $productName[index].textContent,
            items: 1,
            price1: Number(($productPrice[index].textContent).replace("$", "")),           
            price2: Number(($productPrice[index].textContent).replace("$", ""))*1,
        };
    } 

    numberProducts[index].textContent = 1;
    update = true;
    updateCart(cart);
 }

 function incrementItems(index) {
    itemCount =parseInt($numberProducts[index].textContent);
    itemCount++;
    $numberProducts[index].textContent = itemCount;


    if(!cart[index]) {
        cart[index] = {
            id: index,
            img: $productPic[index].src,
            name: $productName[index].textContent,
            items: itemCount,
            price1: Number(($productPrice[index].textContent).replace("$", "")),           
            price2: Number(($productPrice[index].textContent).replace("$", ""))*itemCount,
        };
    } else {
        cart[index] = {
            id: index,
            img: $productPic[index].src,
            name: $productName[index].textContent,
            price1: Number(($productPrice[index].textContent).replace("$", "")),            
            price2: Number(($productPrice[index].textContent).replace("$", ""))*itemCount,
            items: itemCount++
        }
    }
    update = true;
    updateCart(cart);
 }   
}

function updateCart(cart) {
    if(update === false) {
        return;
    } else {

    const CartContainer = document.querySelector(".cart-items_container");
    const orderContainer = document.querySelector(".order-container");
    const numberItemCart = document.querySelector(".number-items");

    const empty = document.querySelector(".empty");

    if(Object.values(cart).length !== 0) {
        empty.classList.add("hide");
        orderContainer.classList.remove("hide");
    } else {
        empty.classList.remove("hide");
        orderContainer.classList.add("hide");
        numberItemCart.textContent = 0;
    }

    const cartItemsContainer = document.querySelector("#cart-items");
    cartItemsContainer.textContent = "";    
    const totalBill = document.querySelector("#total-account");
    let count = 0;

    if(cart!== undefined) {
    let products = Object.entries(cart);

    products.forEach((item, index) => {
        console.log(item[1].id);
        // Total items in cart
        if(!totalProducts[Number(item[1].id)]) {
            totalProducts[Number(item[1].id)] = Number(item[1].items);
        } 
        if(totalProducts[Number(item[1].id)]){
            totalProducts[Number(item[1].id)] = Number(item[1].items);
        }

        console.log(Object.values(totalProducts));

        if(Object.values(totalProducts).length > 0) {
        let sumProducts = Object.values(totalProducts).reduce((acum, cur) => acum + cur);
        numberItemCart.textContent = sumProducts;
        console.log(totalProducts);          
        }

        // Total bill
        if(!bill[Number(item[1].id)]) {
            bill[Number(item[1].id)] = Number(item[1].price2);
        } else {
            bill[Number(item[1].id)] = Number(item[1].price2);
        }

        let fullBill = Object.values(bill).reduce((acum, cur) => acum + cur);
        totalBill.textContent = fullBill;

        const cartItems = document.createElement("div");
        cartItems.classList.add("cart-items");
        cartItems.dataset.id = item[1].id;

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
        deleteBtn.setAttribute("data-id", count);
        count++;
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

    // Delete all button

        const $deleteAllBtn = document.querySelectorAll(".delete-btn-container button");    
        
        $deleteAllBtn.forEach((deleteBtn, index) => {
            deleteBtn.addEventListener("click", e => {
                e.stopImmediatePropagation();

                if(e) {
                    deleteAllItems(index);
                }
            });

            deleteBtn.addEventListener("mouseover", e => {
                if(e) {
                    deleteIcon.setAttribute("src", "./assets/images/icon-remove-item1.svg");
                }
            })
            
            deleteBtn.addEventListener("mouseout", e => {
                if(e) {
                    deleteIcon.setAttribute("src", "./assets/images/icon-remove-item.svg");
                }
            })
        });

    }) 
    } 
    console.log(cart);
    update = false;
    return;
    }
}

function decrementItems(index) {    
    const orderContainer = document.querySelector(".order-container");
    const cartItems = document.querySelector("#cart-items");
    const cartItem = document.querySelectorAll(".cart-items");
    const empty = document.querySelector(".empty");
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const cartBtn = document.querySelectorAll(".cart-btn");
    const productPic = document.querySelectorAll(".product-pic");
    const numberItems = document.querySelector(".number-items");    
    
    cart[index].items--;
    cart[index].price2 -= cart[index].price1;

    if(cart[index].items === 0) {
        delete cart[index];
        delete totalProducts[index];

        cartItem.forEach(item => {

         if(String(index) === item.getAttribute("data-id")) {
            cartItems.removeChild(item);
            return;
         }   
        })

        if(Object.values(cart).length === 0) {
        empty.classList.remove("hide");
        orderContainer.classList.add("hide");            
        }

        addRemoveBtn[index].classList.add("hide");
        cartBtn[index].classList.remove("hide");
        productPic[index].style.border = "none";
    }
    const numberProducts = document.querySelectorAll(".number-products");
    console.log(cart[index]);

    if(cart[index] === undefined) {
      numberProducts[index].textContent = 0;
      numberItems.textContent = 0;  
    } else {
        numberProducts[index].textContent = cart[index].items;  
    }

    totalProducts = {};
    bill = {};
    update = true;
    updateCart(cart);
    return;
}

function deleteAllItems(index) {
    const cartItems = document.querySelectorAll(".cart-items .cart-item .item-info .product-name");
    const products = Object.values(cart);
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const cartBtn = document.querySelectorAll(".cart-btn");
    const productPic = document.querySelectorAll(".product-pic");  
    
    console.log(index);

    if(cartItems[index].textContent === products[index].name) {
        let number = products[index].id;
        cart[number].items = 0;
        cart[number].price2 = 0;
        bill[index] = 0;
        totalProducts[index] = 0;

        //Update the cart container content
        const numberProducts = document.querySelectorAll(".number-products");
        const numberItems = document.querySelector(".number-items");
        const totalAccount = document.querySelector("#total-account");

        numberProducts[number].textContent = 1;

        delete cart[number];
        delete bill[index];
        delete totalProducts[index]; 

        if(Object.values(totalProducts).length === 0) {
        numberItems.textContent = "0";        
        } else {
            totalProducts = {};
        }

        if(Object.values(bill).length === 0) {
            totalAccount.textContent = "0";       
            } else {
                bill = {};
            }       

        addRemoveBtn[number].classList.add("hide");
        cartBtn[number].classList.remove("hide");
        productPic[number].style.border = "none";
        update = true;
        updateCart(cart);
    }
}

function showOrderCard() {
    const orderCard = document.querySelector(".confirm-order_container");
    const totalOrder = document.querySelector(".total-order");
    const overlay = document.querySelector(".overlay");
    const container = document.querySelector(".container");
    let billTotal = Object.values(bill);
    let valuesCart = Object.values(cart);

    if(valuesCart.length > 0) {
    let products = Object.values(cart);

    products.forEach(product => {
        const itemsContainer = document.querySelector(".items-cart");

        const itemCart = document.createElement("div");
        itemCart.classList.add("item-cart");
        const itemInfoContainer = document.createElement("div");
        itemInfoContainer.classList.add("item-info_container");
        const imgProduct = document.createElement("img");
        imgProduct.setAttribute("src", product.img);
        imgProduct.setAttribute("alt", product.name);
        const itemInfo = document.createElement("div");
        itemInfo.classList.add("item-info");
        const productNameCart = document.createElement("p");
        productNameCart.classList.add("product-name_cart");
        productNameCart.textContent = product.name;

        const priceInfo = document.createElement("div");
        priceInfo.classList.add("price-info");

        const itemNumberCart = document.createElement("p");
        itemNumberCart.classList.add("item-number_cart");
        const itemNumber = document.createElement("span");
        itemNumber.classList.add("item-number");
        itemNumber.textContent = product.items + "x";
        itemNumberCart.appendChild(itemNumber);


        const priceCartItem = document.createElement("p");
        priceCartItem.textContent = "$";
        priceCartItem.classList.add("price-cart_item");
        const priceCart = document.createElement("span");
        priceCart.classList.add("price-cart");
        priceCart.textContent = product.price1;

        priceCartItem.appendChild(priceCart);
        priceInfo.appendChild(itemNumberCart);
        priceInfo.appendChild(priceCartItem);

        itemInfo.appendChild(productNameCart)
        itemInfo.appendChild(priceInfo);
        itemInfoContainer.appendChild(imgProduct);
        itemInfoContainer.appendChild(itemInfo);


        const itemTotalContainer = document.createElement("p");
        itemTotalContainer.classList.add("item-total_container");
        itemTotalContainer.textContent = "$";
        const itemTotal = document.createElement("span");
        itemTotal.classList.add("item-total");
        itemTotal.textContent = product.price2;

        itemTotalContainer.appendChild(itemTotal);
 

        itemCart.appendChild(itemInfoContainer);
        itemCart.appendChild(itemTotalContainer);

        itemsContainer.appendChild(itemCart);

        totalOrder.textContent = billTotal.reduce((accum, curr) => accum + curr);
    })

    orderCard.classList.remove("hide");
    overlay.classList.remove("hide");

    const startOrder = document.querySelector(".start-order_btn");

    startOrder.addEventListener("click", e => {
        if(e) {
            deleteCart();
        }
    })        
    } else {
        return;
    }

}

function deleteCart() {
    const itemsCart = document.querySelector(".items-cart");

    itemsCart.textContent = "";

    const numberItems = document.querySelector(".number-items");
    const totalAccount = document.querySelector("#total-account");
    const confirmOrderContainer = document.querySelector(".confirm-order_container");
    const overlay = document.querySelector(".overlay");
    const numberProductsCard = document.querySelectorAll(".number-products");
    const productPic = document.querySelectorAll(".product-pic");
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const cartBtn = document.querySelectorAll(".cart-btn");
    const orderOptions = document.querySelector(".order-container");
    const empty = document.querySelector(".empty");

    let valuesCart =  Object.keys(cart);
    valuesCart.forEach(val => {
        cart[val].items = 0;
        cart[val].price2 = 0;
        delete cart[val];
    });

    let valuesBill =  Object.keys(bill);
    valuesBill.forEach(val => {
        bill[val] = 0;
        delete bill[val];
    });

    let valuesProducts =  Object.keys(totalProducts);
    valuesProducts.forEach(val => {
        totalProducts[val] = 0;
        delete totalProducts[val];
    });

    numberProductsCard.forEach((el, index) => {
        numberProductsCard[index].textContent = 0;
        addRemoveBtn[index].classList.add("hide");
        cartBtn[index].classList.remove("hide");
        productPic[index].style.border = "none";
    })

    cart = {};
    totalProducts = {}; 
    bill = {};

    numberItems.textContent = "0";
    totalAccount.textContent = "0";

    update = true;
    updateCart(cart);
    confirmOrderContainer.classList.add("hide");
    overlay.classList.add("hide");
    orderOptions.classList.add("hide");
    empty.classList.remove("hide");
}





