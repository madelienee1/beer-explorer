/**
 * Base URL for the API. This is the endpoint from which we fetch the beer data.
 * @type {string}
 * @const
 */
const baseUrl = 'https://api.punkapi.com/v2/beers';

/**
 * Function to like a beer. This function makes a POST request to the server to add the beer to the likedBeers list.
 * @param {number} id - The id of the beer to be liked.
 */
const likeBeer = (id) => {
    // Make a POST request to the server
    fetch('http://localhost:3000/likedBeers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // The body of the request is the id of the beer to be liked
        body: JSON.stringify({ id: id })
    });
}

/**
 * Function to get liked beers. This function fetches the ids of the liked beers from the server, 
 * then fetches the data for these beers from the API. Both requests are chained using the Promise API. 
 * It then displays the beers using the {@link displayBeers} function.
 */
const getLikedBeers = () => {
    // Fetch the ids of the liked beers from the server
    fetch('http://localhost:3000/likedBeers')
        .then(response => response.json())
        .then(ids => {
            // Create a string of ids separated by '|'
            const idsString = ids.reduce((acc, { id }) => acc + (acc ? '|' : '') + id, '');
            // Create a URLSearchParams object with the ids
            const urlParams = new URLSearchParams({ ids: idsString });
            // Fetch the beer data from the API
            return fetch(`${baseUrl}?${urlParams.toString()}`);
        })
        .then(response => response.json())
        // Display the beers using the displayBeers function
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

/**
 * Function to display beers. This function creates a card for each beer and appends it to the beer container.
 * @param {Array} beers - The array of beers to display.
 */
const displayBeers = beers => {
    // Get the beer container element
    const beerContainer = document.getElementById('beer-container');
    // Clear the beer container
    beerContainer.innerHTML = '';

    // For each beer, create a card and append it to the beer container
    beers.forEach(({ image_url, name, tagline, abv, description, id }) => {
        // Create a div for the beer card
        const beerCard = document.createElement('div');
        // Create a button for liking the beer
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.id = id;
        likeButton.textContent = 'Like';

        // Add an event listener to the like button
        likeButton.addEventListener('click', event => {
            // If the beer is not already liked, like it
            if (!likeButton.classList.contains('liked')) {
                likeBeer(event.target.id)
                likeButton.textContent = 'Liked';
                likeButton.classList.add('liked');
            }
        })

        // Set the class and inner HTML of the beer card
        beerCard.className = 'beer-card';
        beerCard.innerHTML = `
            <img src="${image_url}">
            <h2>${name}</h2>
            <h3>${tagline}</h3>
            <p><strong>ABV:</strong> ${abv}%</p>
            <p>${description}</p>`;
        // Append the like button to the beer card
        beerCard.appendChild(likeButton);
        // Append the beer card to the beer container
        beerContainer.appendChild(beerCard);
    });
}

/**
 * Function to get beers. This function fetches beer data from the API based on the user's input, then displays the beers using the displayBeers function.
 */
const getBeers = () => {
    // Get the ABV values from the input elements
    let abvMax = parseInt(filterAbvMax.value);
    let abvMin = parseInt(filterAbvMin.value);

    // Validate the ABV values
    if (abvMin < 0 || abvMin > 25) {
        console.error('abvMin must be between 0 and 25');
        return;
    }
    if (abvMax < 26 || abvMax > 55) {
        console.error('abvMax must be between 26 and 55');
        return;
    }

    // Create an object with the ABV values
    const params = {
        abv_gt: abvMin,
        abv_lt: abvMax
    };

    // If the user has entered a beer name, add it to the params object
    const beerName = searchBox.value;
    if (beerName.trim() !== '') {
        params.beer_name = beerName;
    }

    // Create a URLSearchParams object with the params
    const urlParams = new URLSearchParams(params);

    // Fetch the beer data from the API
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

/**
 * This function is executed when the DOM is fully loaded. It sets up event listeners on the ABV filter input elements.
 * The event listeners update the text content of the corresponding labels whenever the input value changes.
 */
document.addEventListener('DOMContentLoaded', () => {
    const abvMinLabel = document.getElementById('abv-min-label');
    const abvMaxLabel = document.getElementById('abv-max-label');

    filterAbvMin.addEventListener('input', () => {
        abvMinLabel.textContent = `Min: ${filterAbvMin.value}`;
    });

    filterAbvMax.addEventListener('input', () => {
        abvMaxLabel.textContent = `Max: ${filterAbvMax.value}`;
    });
});

/**
 * Get the DOM elements for the ABV filters and the search box.
 * @type {Array.<HTMLElement>}
 */
const [filterAbvMax, filterAbvMin, searchBox] = ['filter-abv-max', 'filter-abv-min', 'search-box'].map(id => document.getElementById(id));

// Add 'change' event listeners to the ABV filters. When the value of a filter changes, the getBeers function is called.
[filterAbvMax, filterAbvMin].forEach(filter => filter.addEventListener('change', getBeers));

/**
 * Get the DOM element for the search button and add a 'click' event listener.
 * When the search button is clicked, the getBeers function is called and the search box is cleared.
 */
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    getBeers();
    searchBox.value = '';
});

// Add a 'click' event listener to the 'liked-beers-button'. When the button is clicked, the getLikedBeers function is called.
document.getElementById('liked-beers-button').addEventListener('click', getLikedBeers);

// Call the getBeers function when the script is loaded to display the initial list of beers.
getBeers()
