// Base API url
const baseUrl = 'https://api.punkapi.com/v2/beers';

// Get references to DOM elements
const beerContainer = document.getElementById('beer-container');
const filterAbvMax = document.getElementById('filter-abv-max');
const filterAbvMin = document.getElementById('filter-abv-min');
const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');

// Function to create beer cards
function createBeerCard({ image_url, name, tagline, abv, description, id }) {
    const beerCard = document.createElement('div');
    beerCard.className = 'beer-card';
    beerCard.innerHTML = `    
        <div class="beer-card">
            <img src="${image_url}">
            <h2>${name}</h2>
            <h3>${tagline}</h3>
            <p><strong>ABV:</strong> ${abv}%</p>
            <p>${description}</p>
            <button id="${id}" class="like-button">Like</button>
            </div>`;
    return beerCard;
}

//Function to handle like button click event
function handleLikeButtonClick(event) {
    //get like button that was clicked and assign it to likeButton
    const likeButton = event.target;
    //cehck if the like button has the class 'liked'. It it doesn't, code inside of statement will run
    if (!likeButton.classList.contains('liked')) {
        likeButton.textContent = 'Liked';
        likeButton.classList.add('liked');
    }
}

//Function to display beers on page
function displayBeers(beers) {
    beerContainer.innerHTML = '';
    //loop through aech beer and create a card for it
    beers.forEach(beer => {
        const beerCard = createBeerCard(beer);
        //append beer cards to the container
        beerContainer.appendChild(beerCard);
        //create like button for each beer
        const likeButton = document.getElementById(beer.id);
        //add event listener to the button
        likeButton.addEventListener('click', handleLikeButtonClick);
    });
}

// Function to validate ABV values
function validateAbvValues(abvMin, abvMax) {
    if (abvMin < 0 || abvMin > 25) {
        console.error('abvMin must be between 0 and 25');
        return false;
    }
    if (abvMax < 26 || abvMax > 55) {
        console.error('abvMax must be between 26 and 55');
        return false;
    }
    return true;
}

// Function to get beers from API
function getBeers() {
    let abvMax = parseInt(filterAbvMax.value);
    let abvMin = parseInt(filterAbvMin.value);

    // Validate ABV values
    if (!validateAbvValues(abvMin, abvMax)) {
        return;
    }

    // parameters for API request
    const params = {
        abv_gt: abvMin,
        abv_lt: abvMax
    };

    // Add beer name to parameters if provided
    const beerName = searchBox.value;
    if (beerName.trim() !== '') {
        params.beer_name = beerName;
    }

    // Convert parameters to URL query string
    const urlParams = new URLSearchParams(params);

    // Fetch data from API
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}



//list of all the filter elements
const filterElements = [filterAbvMax, filterAbvMin];
//function for when the filter value changes
function filterChange() {
    getBeers();
}

//event listener 'change' to each filter element
filterElements.forEach(filterElement => {
    filterElement.addEventListener('change', filterChange);
})


// Add event listener to search button
searchButton.addEventListener('click', () => {
    getBeers(); //call getBeers when search button is clicked
    searchBox.value = '';
});

// Call getBeers function initially to display beers
getBeers();