const apiKey = "i=tt3896198&apikey=f90cd2f2"
const apiSearchUrl = "http://www.omdbapi.com/?"
const watchlistSection = document.getElementById("watchlist-section")
let searchField = document.getElementById("search-field")
const searchBtn = document.getElementById("search-btn")
const searchResultsSection = document.getElementById("search-results")
const searchForm = document.getElementById("search-form")
const clearBtn = document.getElementById("clear-btn")
const allContent = document.querySelector("main")
let searchResults = []
let watchlist = []

searchForm.addEventListener("submit", function(event) {
    event.preventDefault()
    searchMovies()
})
clearBtn.addEventListener("click", function() {
    searchField.value = ""
    searchResults = []
    renderMovies(searchResults, searchResultsSection, "search")
})

allContent.addEventListener("click", function(event) {
    const watchedBtn = event.target.closest(".watched-btn")
    const deleteBtn = event.target.closest(".delete-btn")
    const watchlistBtn = event.target.closest(".watchlist-btn")
    const ratingBtn = event.target.closest(".rating-star")
    if (watchedBtn) {
        const id = watchedBtn.dataset.movieId
        const addedMovie = watchlist.find(movie => movie.imdbID === id)
        addedMovie.isWatched === true ? addedMovie.isWatched = false : addedMovie.isWatched = true
        localStorage.setItem("My watchlist", JSON.stringify(watchlist))
        renderWatchlist()
    }
    if (deleteBtn) {
        const id = deleteBtn.dataset.movieId
        watchlist = watchlist.filter(movie => movie.imdbID !== id)
        localStorage.setItem("My watchlist", JSON.stringify(watchlist))
        renderWatchlist()
        searchMovies()
    }
    if (watchlistBtn) {
        const id = watchlistBtn.dataset.movieId
        const addedMovie = searchResults.find(movie => movie.imdbID === id)
        watchlist.unshift(addedMovie)
        addedMovie.isWatched = false
        localStorage.setItem("My watchlist", JSON.stringify(watchlist))
        searchResults = searchResults.filter(movie => movie.imdbID !== id)
        renderWatchlist()
        renderMovies(searchResults, searchResultsSection, "search")
    }
    if (ratingBtn) {
        const id = ratingBtn.dataset.movieId
        const starPos = ratingBtn.dataset.rating
        const addedMovie = watchlist.find(movie => movie.imdbID === id)
        addedMovie.rating === starPos ? addedMovie.rating = 0 : addedMovie.rating = starPos
        localStorage.setItem("My watchlist", JSON.stringify(watchlist))
        renderWatchlist()
    }
})

function moviesRating(rating, id) {
    let ratingString = ""
    let filledStar = ""
    let emptyStar = ""
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            filledStar += `<span class="rating-star filled-star" data-rating="${[i]}" data-movie-id="${id}">★</span>`
        } else {
            emptyStar += `<span class="rating-star empty-star" data-rating="${[i]}" data-movie-id="${id}">★</span>`
        }
    }
    return ratingString = filledStar + emptyStar
}

function renderWatchlist() {
    watchlist = JSON.parse(localStorage.getItem("My watchlist"))
    renderMovies(watchlist, watchlistSection, "watchlist")
}

async function searchMovies() {
    try {
        const response = await fetch(apiSearchUrl + apiKey + "&s=" + searchField.value)
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`)
        }
        const searchResult = await response.json()
        searchResults = searchResult.Search.filter(result => result.Type !== "game")
        for (let i = 0; i < watchlist.length; i++) {
            searchResults = searchResults.filter(movie => movie.imdbID !== watchlist[i].imdbID)
        }
        renderMovies(searchResults, searchResultsSection, "search")
    }
    catch (error) {
        console.error(error.message)
    }
}

function renderMovies(arr, section, type) {
    let movieCards = ""
    for (i = 0; i < arr.length; i++) {
        movieCards += `
            <div class="card">
                <div class="card-top">
                    <img class="movie-poster" 
                        src="${arr[i].Poster !== "N/A" ? arr[i].Poster : "placeholder.svg"}"
                        onerror="this.src='placeholder.svg'">
                    ${arr[i].isWatched ? `<span class="watched-indicator">Watched</span>` : ""}
                </div>
                <div class="card-bottom">
                    <span class="movie-title">${arr[i].Title}</span>
                    <div class="card-year-rating">
                        <div>
                            <span>${arr[i].Year}</span>
                            <span class="movie-type">· ${arr[i].Type}</span>
                        </div>
                        ${arr[i].isWatched 
                            ?  `<div class="rating-btn">
                                    ${moviesRating(arr[i].rating, arr[i].imdbID)}
                                </div>` 
                            : ""}
                    </div>
                    ${type === "watchlist"
                    ?   `<div class="card-watched-delete">
                            <button class="watched-btn" data-movie-id="${arr[i].imdbID}">${arr[i].isWatched === true ? `Unmark` : `Mark as watched`}</button>
                            <button class="delete-btn" data-movie-id="${arr[i].imdbID}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" fill="var(--text-primary)" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg>
                            </button>
                        </div>`
                    :   `<button class="watchlist-btn" data-movie-id="${arr[i].imdbID}">Add to watchlist</button>`
                    }
                </div>
            </div>
        `
    }
    section.innerHTML = movieCards
}

renderWatchlist()
