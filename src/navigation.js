let maxPage;
let page = 1;
let infiniteScroll;

window.addEventListener(
    'DOMContentLoaded',
    () => {
        navigator();
        // Agregando un estado de carga inical
        window.history.pushState({ loadUrl: window.location.href }, null, '');
    },
    false,
);

searchFormBtn.addEventListener('click', () => {
    if (searchFormInput.value==='') {
    } else {
        location.hash = '#search=' + searchFormInput.value;
    }
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = '';
    } else {
        window.history.back();
    }
});
homeBtn.addEventListener('click', () => {
    location.hash = '#home';
})


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

select.addEventListener('change', () => {
    if (lang === 'es-Co') {
        lang = 'en-Us'
    } else {
        lang = 'es-Co'
    }
    updateApi();
    navigator();
    updateText();
})
function navigator() {
    console.log({location});

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { pasive:false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
            trendsPage();
        } else if (location.hash.startsWith('#search=')) {
            searchPage();
        } else if (location.hash.startsWith('#movie=')) {
            movieDetailsPage();
        } else if (location.hash.startsWith('#category=')) {
            categoriesPage();
        } else if (location.hash.startsWith('#character=')) {
            characterPage();
        } else {
            homePage();
        }

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0 ;

        if (infiniteScroll) {
            window.addEventListener('scroll', infiniteScroll);
        }
}

function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    categoryTitleContainer.classList.add('inactive');
    searchForm.classList.remove('inactive');
    homeBtn.classList.add('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    actorDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview ();
    getLikedMovies();
}

function categoriesPage() {
    console.log('Categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    categoryTitleContainer.classList.remove('inactive');
    homeBtn.classList.remove('inactive');

    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    actorDetailSection.classList.add('inactive');

    // ['#category', 'id-name' ]
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    console.log(categoryName);
    console.log(decodeURIComponent(categoryName));

    categoryTitle.innerHTML = decodeURIComponent(categoryName);

    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetailsPage() {
    console.log('Movie!');

    headerSection.classList.add('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    homeBtn.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    actorDetailSection.classList.add('inactive');

     // ['#movie', '1022' ]
    const [_, movieId] = location.hash.split('=');

    getMovieById(movieId);
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    homeBtn.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    actorDetailSection.classList.add('inactive');

        // ['#search', 'query' ]
        const [_, query] = location.hash.split('=');
        getMoviesBySearch(query);

        infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerTitle.classList.add('header-title--trendsView');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    actorDetailSection.classList.add('inactive');

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}

function characterPage() {
    console.log('Character!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    homeBtn.classList.remove('inactive');
    categoryTitleContainer.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    actorDetailSection.classList.remove('inactive');


     // ['#actor', '1022' ]
    const [_, actorId] = location.hash.split('=');
    console.log(actorId);

    getActorById(actorId);
}

function updateText() {
    if (lang === 'en-Us') {
        headerTitle.innerHTML ='Movies';
        spanish.innerHTML = 'Spanish';
        english.innerHTML = 'English';
        arrowBtn.innerHTML = '&lt; Return';
        searchFormInput.placeholder = "Search movie";
        trendingBtn.innerHTML = 'See more';
        categoriesPreviewTitle.innerHTML = 'Categories';
        likedTitle.innerHTML = 'Favorite movies';
        footer.innerHTML = '"You only fail when you stop trying" Albert Einstein';
        relatedMoviesTitle.innerHTML = 'Related movies';
        headerCategoryTitle.innerHTML = 'Trends';
        trendingPreviewTitle.innerHTML = 'Trends';
        homeBtn.innerHTML = 'Home';
        biographyTitle.innerHTML = 'Biography';
        movieCastTitle.innerHTML = 'Cast';
    } else {
        headerTitle.innerHTML ='Películas';
        spanish.innerHTML = 'Español';
        english.innerHTML = 'Inglés';
        arrowBtn.innerHTML = '&lt; Volver';
        searchFormInput.placeholder = "Buscar película";
        trendingBtn.innerHTML = 'Ver más';
        categoriesPreviewTitle.innerHTML = 'Categorias';
        likedTitle.innerHTML = 'Películas favoritas';
        footer.innerHTML = '"El poder de la imaginación nos hace infinitos." John Muir.';
        relatedMoviesTitle.innerHTML = 'Películas similares';
        headerCategoryTitle.innerHTML = 'Tendencias';
        trendingPreviewTitle.innerHTML = 'Tendencias';
        homeBtn.innerHTML = 'Inicio';
        biographyTitle.innerHTML = 'Biografía';
        movieCastTitle.innerHTML = 'Reparto';
    }
}