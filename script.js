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

        //beer card contains an image, name, tagline, abv, and description
        // append the like button to the beer card
        // append the beer card to the beer container
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

//function to get beers from API
const getBeers = () => {
    //get values from filterAbvMax and filterAbvMin elements
    let abvMax = parseInt(filterAbvMax.value);
    let abvMin = parseInt(filterAbvMin.value);

    //check if abvMin and abvMax are valid numbers
    if (abvMin < 0 || abvMin > 25) {
        console.error('abvMin must be between 0 and 25');
        return;
    }
    if (abvMax < 26 || abvMax > 55) {
        console.error('abvMax must be between 26 and 55');
        return;
    }

    //const params is an object with properties abv_gt and abv_lt
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
    // URLSearchParams is a built in class that generates a query string from an object
    const urlParams = new URLSearchParams(params);

    //GET request to API. URL is constructed by appending the query string generated from URLparams to baseurl
    // response is converted to json and passed to displayBeers function
    fetch(`${baseUrl}?${urlParams.toString()}`)
        .then(response => response.json())
        .then(beers => displayBeers(beers))
        .catch(error => console.error('Error:', error));
}

//get references to elements (filterAbvMax, filterAbvMin, searchBox)
const filterAbvMax = document.getElementById('filter-abv-max');
const filterAbvMin = document.getElementById('filter-abv-min');
const searchBox = document.getElementById('search-box');

//create an array of the filter elements
const filters = [filterAbvMax, filterAbvMin];

//lop through the array of filter elements and add an event listener to each
for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener('change', getBeers);
}


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
