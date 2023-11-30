// Use const for baseUrl since it's not going to change
const baseUrl = 'https://api.punkapi.com/v2/beers';

// Use arrow function syntax for functions
const displayBeers = beers => {
    const beerContainer = document.getElementById('beer-container');
    beerContainer.innerHTML = ''; // clear the container

    beers.forEach(({ image_url, name, tagline, abv }) => { // Destructure beer properties
        const beerCard = document.createElement('div');
        beerCard.className = 'beer-card';
        beerCard.innerHTML = `
            <img src="${image_url}">
            <h2>${name}</h2>
            <h3>${tagline}</h3>
            <p><strong>ABV:</strong> ${abv}%</p>
            <button class="like-button">Like</button>`;
        beerContainer.appendChild(beerCard);
    });

    // Use event delegation to handle like button clicks
    // This reduces the number of event listeners and improves performance
    beerContainer.addEventListener('click', event => {
        if (event.target.classList.contains('like-button')) {
            event.target.textContent = 'Liked';
            event.target.classList.add('liked');
        }
    });
}

// Use destructuring to get filter elements
const [filterAbvMax, filterAbvMin,searchBox] = ['filter-abv-max', 'filter-abv-min','search-box'].map(id => document.getElementById(id));


// Use Promises for asynchronous operations
const getBeers = () => {
    const abvMax = filterAbvMax.value;
    const abvMin = filterAbvMin.value;
    const beerName = searchBox.value;

    const params = {
        abv_gt: abvMin,
        abv_lt: abvMax
    };

    // Only add the beer_name parameter if it's not an empty string
    if (beerName.trim() !== '') {
        params.beer_name = beerName;
    }

    // Convert params object to a URLSearchParams instance
    const urlParams = new URLSearchParams(params);
    console.log({urlParams})

    // Append params to the base URL
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

// Add event listeners in a loop to reduce repetition
[filterAbvMax, filterAbvMin].forEach(filter => filter.addEventListener('change', getBeers));


const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', getBeers);



getBeers()