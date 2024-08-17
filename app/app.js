const d = document;
const $productsContainer = document.querySelector("#products-container");
const $productTemplate = document.getElementById("product-grid").content.cloneNode(true);
let itemVal = 1;
let currentProduct = 0;

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
}

document.addEventListener("DOMContentLoaded", loadProducts())

// Buttons

function addFunctionality() {
    const cartBtns = document.querySelectorAll(".cart-btn");
    const addRemoveBtn = document.querySelectorAll(".add-remove_btn");
    const productPic = document.querySelectorAll(".product-pic")
    console.log(cartBtns);

    cartBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            currentProduct = parseInt(e.currentTarget.dataset.id);
            console.log(typeof currentProduct);

            e.currentTarget.classList.add("hide");
            addRemoveBtn[currentProduct-1].classList.remove("hide");
            productPic[currentProduct-1].style.border = "3px solid var(--red)"
    })

    })
}    

