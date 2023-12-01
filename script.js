// Use const for baseUrl since it's not going to change
const baseUrl = 'https://api.punkapi.com/v2/beers';

const likeBeer = (id) => {
    // Make a POST request to add the beer to the likedBeers list
    fetch('http://localhost:3000/likedBeers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    });
}

const getLikedBeers = () => {
    fetch('http://localhost:3000/likedBeers')
        .then(response => response.json())
        .then(ids => {
            const idsSring = ids.reduce((acc, { id }) => acc + `${id}|`, '');
            const urlParams = new URLSearchParams({ ids: idsSring });

            // Append params to the base URL
            fetch(`${baseUrl}?${urlParams.toString()}`)
                .then(response => response.json())
                .then(beers => displayBeers(beers))
                .catch(error => console.error('Error:', error));

        })
        .catch(error => console.error('Error:', error));
}

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

// Use arrow function syntax for functions
const displayBeers = beers => {
    const beerContainer = document.getElementById('beer-container');
    beerContainer.innerHTML = ''; // clear the container

    beers.forEach(({ image_url, name, tagline, abv, description, id }) => { // Destructure beer properties
        const beerCard = document.createElement('div');
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.id = id;
        likeButton.textContent = 'Like';

        likeButton.addEventListener('click', event => {
            console.log({ fireEvent: event.target })
            if (!likeButton.classList.contains('liked')) {
                likeBeer(event.target.id)
                likeButton.textContent = 'Liked';
                likeButton.classList.add('liked');
            }
        })


        beerCard.className = 'beer-card';
        beerCard.innerHTML = `
            <img src="${image_url}">
            <h2>${name}</h2>
            <h3>${tagline}</h3>
            <p><strong>ABV:</strong> ${abv}%</p>
            <p>${description}</p>`;
        beerCard.appendChild(likeButton);
        beerContainer.appendChild(beerCard);


    });

    // Use event delegation to handle like button clicks
    // This reduces the number of event listeners and improves performance

}

// Use destructuring to get filter elements
const [filterAbvMax, filterAbvMin, searchBox] = ['filter-abv-max', 'filter-abv-min', 'search-box'].map(id => document.getElementById(id));



// Use Promises for asynchronous operations
const getBeers = () => {
    let abvMax = parseInt(filterAbvMax.value);
    let abvMin = parseInt(filterAbvMin.value);

    // Validate and constrain abvMin and abvMax
    if (abvMin < 0 || abvMin > 25) {
        console.error('abvMin must be between 0 and 25');
        return;
    }
    if (abvMax < 26 || abvMax > 55) {
        console.error('abvMax must be between 26 and 55');
        return;
    }

    const params = {
        abv_gt: abvMin,
        abv_lt: abvMax
    };

    // Only add the beer_name parameter if it's not an empty string
    const beerName = searchBox.value;
    if (beerName.trim() !== '') {
        params.beer_name = beerName;
    }

    // Convert params object to a URLSearchParams instance
    const urlParams = new URLSearchParams(params);
    console.log({ urlParams })

    // Append params to the base URL
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

// Add event listeners in a loop to reduce repetition
[filterAbvMax, filterAbvMin].forEach(filter => filter.addEventListener('change', getBeers));


const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    getBeers();
    searchBox.value = '';
});

document.getElementById('liked-beers-button').addEventListener('click', getLikedBeers);
getBeers()