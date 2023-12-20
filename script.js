//base API url
const baseUrl = 'https://api.punkapi.com/v2/beers';

//function to display beers on the page
//takes an array of beer objects as an argument

const displayBeers = beers => {
    const beerContainer = document.getElementById('beer-container');
    beerContainer.innerHTML = '';


    //creates a div element for each beer object and appends it to the beer-container div
    //each beer div contains an image, name, tagline, abv, and description
    //each beer div also contains a 'like' button
    beers.forEach(({ image_url, name, tagline, abv, description, id }) => {
        const beerCard = document.createElement('div');
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.id = id;
        likeButton.textContent = 'Like';

        //EVENT LISTENER 1: add event listener to like button that changes the text content and background color of the button when clicked
        likeButton.addEventListener('click', event => {
            if (!likeButton.classList.contains('liked')) {
                likeButton.textContent = 'Liked';
                likeButton.style.backgroundColor = 'orange';
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
}


const getBeers = () => {
    let abvMax = parseInt(filterAbvMax.value);
    let abvMin = parseInt(filterAbvMin.value);

    if (abvMin < 0 || abvMin > 25) {
        console.error('abvMin must be between 0 and 25');
        return;
    }
    if (abvMax < 26 || abvMax > 55) {
        console.error('abvMax must be between 26 and 55');
        return;
    }
    //object params with properties abv_gt & abv_lt - used as query parameters to the API request
    const params = {
        abv_gt: abvMin,
        abv_lt: abvMax
    };

    //perform search for beers based on the name entered into search box
    const beerName = searchBox.value;

    //check if beer name is not an empty string after removing whitespace if not empty, adds beer_name as 
    //a property to the params object with value of beerName
    if (beerName.trim() !== '') {
        params.beer_name = beerName;
    }
    //create a new URLSearchParams object with the params object as an argument
    const urlParams = new URLSearchParams(params);

    //GET request to API. URL is constructed by appending the query string generated from URLparams to baseurl
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

const [filterAbvMax, filterAbvMin, searchBox] = ['filter-abv-max', 'filter-abv-min', 'search-box'].map(id => document.getElementById(id));
//add change event listeners to the filterAbvMax and filterAbvMin elements that call the getBeers function when user changes input
[filterAbvMax, filterAbvMin].forEach(filter => filter.addEventListener('change', getBeers));

// document.addEventListener('DOMContentLoaded', () => {
const abvMinLabel = document.getElementById('abv-min-label');
const abvMaxLabel = document.getElementById('abv-max-label');

filterAbvMin.addEventListener('input', () => {
    abvMinLabel.textContent = `Min: ${filterAbvMin.value}`;
});

filterAbvMax.addEventListener('input', () => {
    abvMaxLabel.textContent = `Max: ${filterAbvMax.value}`;
});
// });





const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    getBeers();
    searchBox.value = '';
});



getBeers()



// document.getElementById('liked-beers-button').addEventListener('click', getLikedBeers);

// const likeBeer = (id) => {
//     fetch('http://localhost:3000/likedBeers', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ id: id })
//     });
// }

// const getLikedBeers = () => {
//     fetch('http://localhost:3000/likedBeers')
//         .then(response => response.json())
//         .then(ids => {
//             const idsString = ids.reduce((acc, { id }) => acc + (acc ? '|' : '') + id, '');
//             const urlParams = new URLSearchParams({ ids: idsString });
//             return fetch(`${baseUrl}?${urlParams.toString()}`);
//         })
//         .then(response => response.json())
//         .then(beers => displayBeers(beers))
//         .catch(error => console.error('Error:', error));
// }
