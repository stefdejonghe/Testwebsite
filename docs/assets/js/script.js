"use strict"

window.addEventListener("load", Initialise);

// Globale variabelen
var gamesCollection;
var slcCategories;
var overview;
var details;
var selectedGame;
var basket = [];
var orders;
var basketDiv;

function Initialise() {
    // Inlezen DOM elementen
    slcCategories = document.getElementById("categories");
    overview = document.getElementById("overview");
    details = document.getElementById("details");
    orders = document.getElementById("orders");

    // Toevoegen Eventlisteners
    slcCategories.addEventListener("change", ShowGames);

    // Functies
    FetchData();
}

function FetchData() {
    fetch("https://howest-gp-wfa.github.io/st-2021-1-S2-A-ee-game-store-stefdejonghe/api/games.json")
        .then(function (response) {
            return response.json();
        }).then(function (arr) {
            gamesCollection = arr;
            FillSelect();
            AddBasketDiv();
        });
}

function AddBasketDiv() {
    basketDiv = document.createElement('div');
    orders.appendChild(basketDiv);
}

function FillSelect() {
    for (let category in gamesCollection) {
        let slcOption = new Option(category, `opt${category}`);
        slcCategories.options[slcCategories.length] = slcOption;
        slcOption.id = `opt${category}`;
    }
    ShowGames();
}

function ShowGames() {
    if (slcCategories.selectedIndex !== -1) {
        let category = GetSelectedCategory();
        let selectedGames = gamesCollection[category];
        MakeCards(selectedGames);
    }
}

function GetSelectedCategory() {
    let selectedCategory;
    for (let i = 0; i < slcCategories.length; i++) {
        selectedCategory = slcCategories.options[i];
        if (selectedCategory.selected)
            break;
    }
    return selectedCategory.text;
}

function MakeCards(selectedGames) {
    overview.innerHTML = "";
    for (let game of selectedGames)
    {
        let card = document.createElement('article');
        card.id = game.Name;
        let nameGame = document.createElement("h3");
        let imgGame = document.createElement('img');
        card.addEventListener("mouseenter", ShowDetailsGame);

        nameGame.innerHTML = game.Name;
        imgGame.src = `img/${game.Image}`
        card.appendChild(nameGame);
        card.appendChild(imgGame);
        overview.appendChild(card);
    }
}

function ShowDetailsGame() {
    details.innerHTML = "";
    let category = GetSelectedCategory();
    let selectedGames = gamesCollection[category];
    
    selectedGame = selectedGames.find(game => game.Name === this.id);
    let product = document.createElement('form');
    product.className = "product";

    let gameTitleLabel = document.createElement('label');
    gameTitleLabel.className = "titel";
    gameTitleLabel.innerHTML = "Naam:";

    let gameTitleText = document.createElement('label');
    gameTitleText.className = "block";
    gameTitleText.innerHTML = selectedGame.Name;

    let gameTypeLabel = document.createElement('label');
    gameTypeLabel.innerHTML = "Type:";
    gameTypeLabel.className = "titel";

    let gameTypeText = document.createElement('label');
    gameTypeText.className = "block";
    gameTypeText.innerHTML = selectedGame.Type;

    let gamePriceLabel = document.createElement('label');
    gamePriceLabel.className = "titel";
    gamePriceLabel.innerHTML = "Prijs:";

    let gamePriceText = document.createElement('label');
    gamePriceText.className = "block";
    gamePriceText.innerHTML = `€ ${selectedGame.Price}`;

    let gameDescriptionLabel = document.createElement('label');
    gameDescriptionLabel.className = "titel";
    gameDescriptionLabel.innerHTML = "Omschrijving:";

    let gameDescriptionText = document.createElement('label');
    gameDescriptionText.className = "block";
    gameDescriptionText.innerHTML = selectedGame.Description;

    let gameImgLabel = document.createElement('label');
    gameImgLabel.className = "titel";
    gameImgLabel.innerHTML = "Sfeerbeelden:";

    let imgs = selectedGame.DetailImages;

    product.appendChild(gameTitleLabel);
    product.appendChild(gameTitleText);
    product.appendChild(gameTypeLabel);
    product.appendChild(gameTypeText);
    product.appendChild(gamePriceLabel);
    product.appendChild(gamePriceText);
    product.appendChild(gameDescriptionLabel);
    product.appendChild(gameDescriptionText);

    product.appendChild(gameImgLabel);

    if(Array.isArray(imgs))
    {
        imgs.forEach(img => {
            let detailImg = document.createElement('img');
            detailImg.src = `img/${img}`;
            product.appendChild(detailImg);
        });
    }
    else
    {
        let detailImg = document.createElement('img');
        detailImg.src = `img/${selectedGame.DetailImages}`;
        product.appendChild(detailImg);
    }

    let btnOrder = document.createElement('button');
    btnOrder.id = "btnOrder";
    btnOrder.type = "button";
    btnOrder.innerHTML = "Bestel mij";
    btnOrder.className = "btn-yellow";
    btnOrder.addEventListener("click", AddGameToBasket);
    product.appendChild(btnOrder);
    
    details.appendChild(product);
}

function AddGameToBasket() {
    if(!basket.some(game => game === selectedGame))
    {
        selectedGame["Amount"] = 1;
        basket.push(selectedGame);
        console.log(basket);
    }
    else {
        basket.find(game => game === selectedGame).Amount += 1;
        console.log(basket);
    }
    ShowBasket();
}

function ShowBasket() {
    basketDiv.innerHTML = "";
    let totalPrice = 0;

    basket.forEach(game => {
        let basketRow = document.createElement('div');
        basketRow.className = "bestelling";
        basketRow.innerHTML = `<b>Spelnaam:</b> ${game.Name}, <b>Prijs =</b> ${game.Price}, <b>Aantal =</b> ${game.Amount}`;
        basketDiv.appendChild(basketRow);
    });

    basket.forEach(game => {
        totalPrice += game.Price * game.Amount;
    });

    let totalPriceDiv = document.createElement('div');
    totalPriceDiv.className = "totaal";
    totalPriceDiv.innerHTML = `De totale prijs: € ${parseFloat(totalPrice).toFixed(2)}`;

    basketDiv.appendChild(totalPriceDiv);
}

