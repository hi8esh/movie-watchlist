const apiKey = '7dfd5417'
const searchBtnEL = document.getElementById("searchBtn")
const searchInputEl = document.getElementById("searchInput")
const moviesEl = document.getElementById("movies")
const placeholderEL = document.getElementById("placeholder")

searchBtnEL.addEventListener("click", getMovies)

async function getMovies() {
    placeholderEL.innerHTML = ``;
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
            await renderMovies(data.Search);
        } else {
            moviesEl.innerHTML = `<p class="error-message">${data.Error}</p>`;
        }
    } catch (err) {
        console.error(err);
        moviesEl.innerHTML = `<p class="error-message">Something went wrong. Please try again later.</p>`;
    }
}


async function renderMovies(movies){
    let moviesHtml = ``;

    for (const movie of movies) {
        const imdbID = movie.imdbID;
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=short`);
        const data = await res.json();

        const ratings = data.Ratings.find(rat => rat.Source === 'Internet Movie Database');
        const ratingsValue = ratings ? ratings.Value : 'N/A';
        const watchList = JSON.parse(localStorage.getItem('watchlisht')) || [];
        const isWatchList = watchList.includes(imdbID);
        const buttonText = isWatchList ? 'Remove' : 'WatchList';

        moviesHtml += `
            <div class="movie-list"> 
                <div> 
                    <img src="${data.Poster}" class="poster" alt="poster of the movie">
                </div>
                <div class="text-info"> 
                    <div class="rating"> 
                        <h3> ${data.Title} </h3>
                        <img src="images/Star-Icon.svg" class="star" alt="image of a small star">
                        <p>${ratingsValue} </p>
                    </div>
                    <div class="watchlist"> 
                        <p> ${data.Runtime} </p>
                        <p> ${data.Genre} </p>
                        <button onclick="addToWatchlist('${data.imdbID}')" id="watchlist-btn-${imdbID}">
                            <i class="fa-solid fa-circle-plus"></i> ${buttonText}
                        </button>
                    </div>
                    <div class="plot"> 
                        <p> ${data.Plot} </p>
                    </div>
                </div>
            </div>
        `;
    }

    moviesEl.innerHTML = moviesHtml;
}
