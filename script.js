const apiKey = '7dfd5417'

// DOM elements
const searchBtnEL = document.getElementById("searchBtn")
const searchInputEl = document.getElementById("searchInput")
const moviesEl = document.getElementById("movies")
const placeholderEL = document.getElementById("placeholder")
const watchlistBody = document.getElementById("watchlistBody")

// ===================== SEARCH PAGE =====================
if (searchBtnEL) {
    searchBtnEL.addEventListener("click", getMovies)
}

async function getMovies() {
    placeholderEL.style.display = 'none';
    moviesEl.innerHTML = `<div class="loading-spinner"></div>`;

    const query = searchInputEl.value.trim();
    if (query === '') {
        moviesEl.innerHTML = `<p class="error-message">Please enter something! We can't search nothing.</p>`;
        return;
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        const data = await res.json();

        if (data.Response === 'True') {
            await renderMovies(data.Search, moviesEl, true);
        } else {
            moviesEl.innerHTML = `<p class="error-message">${data.Error}</p>`;
        }
    } catch (err) {
        console.error(err);
        moviesEl.innerHTML = `<p class="error-message">Something went wrong. Please try again later.</p>`;
    }
}

// ===================== WATCHLIST PAGE =====================
document.addEventListener('DOMContentLoaded', () => {
    if (watchlistBody) {
        renderWatchlist()
    }
})

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

    if (watchlist.length === 0) {
        watchlistBody.innerHTML = `
        <p>No movies in your watchlist!</p>
        <button><i class="fa-solid fa-circle-plus"></i> <a href="index.html">Let's add some movies!</a></button>
        `
    } else {
        watchlistBody.innerHTML = ''
        renderMovies(watchlist, watchlistBody, false)
    }
}

// ===================== SHARED RENDER FUNCTION =====================
async function renderMovies(movieIDs, container, allowToggle) {
    let html = ``

    for (const movie of movieIDs) {
        const imdbID = typeof movie === 'string' ? movie : movie.imdbID;
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=short`);
        const data = await res.json();

        const ratings = data.Ratings.find(r => r.Source === 'Internet Movie Database');
        const ratingsValue = ratings ? ratings.Value : 'N/A';

        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const isInWatchlist = watchlist.includes(imdbID);
        const buttonText = allowToggle
            ? (isInWatchlist ? 'Remove' : 'WatchList')
            : 'Remove';
        const icon = buttonText === 'WatchList' ? 'fa-circle-plus' : 'fa-circle-minus';

        const buttonHTML = allowToggle
            ? `<button onclick="toggleWatchlist('${imdbID}')" id="watchlist-btn-${imdbID}">
                    <i class="fa-solid ${icon}"></i> ${buttonText}
                </button>`
            : `<button onclick="removeFromWatchlist('${imdbID}')" class="remove">
                    <i class="fa-solid fa-circle-minus"></i> Remove
                </button>`;

        html += `
            <div class="movie-list"> 
                <div> 
                    <img src="${data.Poster !== 'N/A' ? data.Poster : 'images/Image-not-found.png'}" class="poster" alt="poster of the movie">
                </div>
                <div class="text-info"> 
                    <div class="rating"> 
                        <h3>${data.Title}</h3>
                        <img src="images/Star-Icon.svg" class="star" alt="star">
                        <p>${ratingsValue}</p>
                    </div>
                    <div class="watchlist"> 
                        <p>${data.Runtime}</p>
                        <p>${data.Genre}</p>
                        ${buttonHTML}
                    </div>
                    <div class="plot"> 
                        <p>${data.Plot}</p>
                    </div>
                </div>
            </div>
        `
    }

    container.innerHTML = html
}

// ===================== WATCHLIST MANAGEMENT =====================
function toggleWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    const idx = watchlist.indexOf(imdbID)

    if (idx === -1) {
        watchlist.push(imdbID)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
        alert("Successfully added to the watchlist")
        document.getElementById(`watchlist-btn-${imdbID}`).innerHTML = `<i class="fa-solid fa-circle-minus"></i> Remove`
    } else {
        watchlist.splice(idx, 1)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
        alert("Removed from the watchlist")
        document.getElementById(`watchlist-btn-${imdbID}`).innerHTML = `<i class="fa-solid fa-circle-plus"></i> WatchList`
    }
}

function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    watchlist = watchlist.filter(id => id !== imdbID)
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    renderWatchlist()
}
