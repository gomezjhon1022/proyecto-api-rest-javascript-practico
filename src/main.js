// Data
let lang = 'es-Co';


let api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': lang,
    },
});

function updateApi() {
    api = axios.create({
        baseURL: 'https://api.themoviedb.org/3/',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        params: {
            'api_key': API_KEY,
            'language': lang,
        },
    });
}

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    const liked =likedMoviesList();
    if (Object.entries(liked).length === 0) {
        console.log('no existe liked');
        likedMoviesListArticle.classList.add('inactive');
    } else {
        likedMoviesListArticle.classList.remove('inactive');
        getLikedMovies();
    }

}

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url);
        }
    });
})


function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
    if (clean) {
        container.innerHTML = "";
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img': 'src', 'https://image.tmdb.org/t/p/w500' + movie.poster_path);

        movieImg.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
            });
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&w=400')
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');

        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            //tendencias preview
            getTrendingMoviesPreview();
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);

    });
}

function createCast(cast, container, { lazyLoad = false} = {}) {
    container.innerHTML = "";
    cast.forEach(character => {

        const characterContainer = document.createElement('div');
        characterContainer.classList.add('card-cast');

        const characterImg = document.createElement('img');
        characterImg.classList.add('cast-img');
        characterImg.setAttribute('alt', character.name);
        const urlImg = 'https://image.tmdb.org/t/p/w500' + character.profile_path
        characterImg.setAttribute(
            lazyLoad ? 'data-img': 'src', urlImg );

        const figure = document.createElement('figure');
        const layer = document.createElement('div');
        layer.classList.add('layer');

        layer.addEventListener('click', () => {
                location.hash = '#character=' + character.id;
            });
        characterImg.addEventListener('error', () => {
            characterImg.setAttribute('src', 'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&w=400')
        });

        const characterName = document.createElement('h2');
        characterName.classList.add('card-cast-name');
        const characterNameText = document.createTextNode(character.name);

        const characterCharacter = document.createElement('h3');
        characterCharacter.classList.add('card-cast-character');
        const characterCharacterText = document.createTextNode(character.character);

        if (lazyLoad) {
            lazyLoader.observe(characterImg);
        }
        characterName.appendChild(characterNameText);
        characterCharacter.appendChild(characterCharacterText);
        characterContainer.appendChild(characterImg);

        layer.appendChild(characterName);
        characterContainer.appendChild(layer);
        layer.appendChild(characterCharacter);
        characterContainer.appendChild(layer);
        figure.appendChild(characterContainer);
        container.appendChild(figure);


    });
}

function createCategories (categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);


    });
}

// Llamados a la API

async function getTrendingMoviesPreview () {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, true);
}

async function getCategoriesPreview () {
    const { data } = await api('genre/movie/list');
    const categories =data.genres;

    createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {

    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    console.log(movies);

    maxPage = data.total_pages;

    createMovies(movies, genericSection, {lazyLoad: true});
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {

            page++;

            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;

            createMovies(movies, genericSection, {lazyLoad: true,     clean: false});
        }
    }
}

async function getMoviesBySearch(query) {

    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);

    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {

            page++;

            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, {lazyLoad: true,     clean: false});
        }
    }
}

async function getTrendingMovies () {

    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection,{lazyLoad: true, clean: true});
}

async function getPaginatedTrendingMovies() {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {

        page++;

        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;

        createMovies(movies, genericSection, {lazyLoad: true,     clean: false});
    }
}

async function getMovieById (id) {

    const { data: movie } = await api('movie/' + id);
    console.log(movie);
    const movieImgUrl = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.55) 22.27%, rgba(0, 0, 0, 0) 29.35%),
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title ;
    movieDetailDescription.textContent =  movie.overview;
    movieDetailScore.textContent = movie.vote_average ;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
    getCastId(id);

}

async function getActorById (id) {

    const { data: actor } = await api('person/' + id);
    console.log(actor);

    actorName.textContent = actor.name +" ( "+ actor.birthday + (actor.deathday? " , " +actor.deathday +" ) ": " ) ");
    biography.textContent = actor.biography;
    actorPopularity.textContent = actor.popularity;
    actorImage.setAttribute('src','https://image.tmdb.org/t/p/original'+actor.profile_path);

}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;
    console.log('relacionadas',relatedMovies);

    createMovies(relatedMovies, relatedMoviesContainer);

    relatedMoviesContainer.scrollTo(0, 0);

}
async function getCastId(id) {
    const { data } = await api(`movie/${id}/credits`);
    const cast = data.cast;
    console.log('casting',cast);
    createCast(cast, movieCastContainer);

    relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true});
}


