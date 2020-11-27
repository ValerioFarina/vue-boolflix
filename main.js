const urlMovieDb3 = 'https://api.themoviedb.org/3/';
const urlSearch = urlMovieDb3 + 'search/';
const urlConfig = urlMovieDb3 + 'configuration';
const urlMovie = urlMovieDb3 + 'movie/';
const urlTv = urlMovieDb3 + 'tv/';
const urlMovieGenres = urlMovieDb3 + 'genre/movie/list';
const urlTvGenres = urlMovieDb3 + 'genre/tv/list';
const apiKey = '8762c3f242ebc4064f2c46af1dbdebc0';


var app = new Vue({
    el : '#root',

    data : {
        searched : {
            input : '',
            title : ''
        },
        search : {
            movies : {
                result : [],
                loaded : false,
                isLoading : false,
                urls : {
                    search : urlSearch + 'movie',
                    info : urlMovie
                }
            },
            tvSeries : {
                result : [],
                loaded : false,
                isLoading: false,
                urls : {
                    search : urlSearch + 'tv',
                    info : urlTv
                }
            },
            numberOfResults : 0
        },
        posterUrl : {
            baseUrl : '',
            posterSize : 'w342',
            defaultUrl : 'img/poster_not_available.png'
        },
        flagsAvailable : [
            'en',
            'it',
            'de',
            'es',
            'fr',
            'ja'
        ],
        genres : {
            all : [],
            checked : []
        },
        showFilterMenu : false
    },

    methods : {
        // this function takes as input either the object search.movies or the object search.tvSeries
        // in the first case, it populates the array search.movies.result with objects representing movies
        // in the second case, it populates the array search.tvSeries.result with objects representing tv series
        startSearch(object) {
            // we reset the value of loaded
            object.loaded = false;
            // we set the value of isLoading equal to true
            object.isLoading = true;
            // we reset the value of numberOfResults
            this.search.numberOfResults = 0;
            axios
                // we get the movies/tv-series that match the search made by the user
                .get(object.urls.search, {
                    params: {
                        api_key: apiKey,
                        query: this.searched.title
                    }
                })
                .then((responseObject) => {
                    // we add the movies/tv-series to the corresponding array
                    object.result = responseObject.data.results;
                    // we add to numberOfResults the number of movies/tv series we have obtained
                    this.search.numberOfResults += object.result.length;
                    let creditsRequests = [];
                    object.result.forEach((item) => {
                        // for each movie/tv series we added to the corresponding array, we make a request (i.e. we get a promise)
                        const creditsRequest = axios.get(
                            object.urls.info + item.id + '/credits',
                            {
                                params : {
                                    api_key: apiKey
                                }
                            }
                        );
                        // we push the request in the array creditsRequest
                        creditsRequests.push(creditsRequest);
                    });
                    axios.all(creditsRequests).then(
                        axios.spread((...responses) => {
                            // once every request (i.e. every promise) has been fulfilled,
                            // we go through the corresponding array of responses
                            responses.forEach((response, index) => {
                                // each response contains an array named "cast"
                                // more precisely, given an index i, the response in position i within the array of responses
                                // contains informations about the cast of the movie/tv-series in position i within the array object.result
                                // we save in object.result[i] only the names about the first 5 members of the corresponding cast
                                object.result[index].cast = response.data.cast.slice(0, 5).map(person => person.name);
                            });
                            // we reset the value of isLoading
                            object.isLoading = false;
                            // we set the value of loaded equal to true
                            object.loaded = true;
                        })
                    );
                });
        },
        // this function populates the array search.movies.result with objects representing movies
        // and the array search.tvSeries.result with objects representing tv series
        // according to the value of searched.input (which is the text written by the user in the input)
        getSearchResult() {
            if (this.searched.input.trim() != '') {
                // if the input inserted by the user is not an empty string
                // we save in searched.title the value of searched.input
                this.searched.title = this.searched.input.trim();
                // we reset the value of searched.input
                this.searched.input = '';
                // we populate the array search.movies.result with objects representing movies according to the search made by the user
                this.startSearch(this.search.movies);
                // we populate the array search.tvSeries.result with objects representing tv series according to the search made by the user
                this.startSearch(this.search.tvSeries);
            }
        },
        // this function checks if an object represents a movie or a tv series
        isMovie(object) {
            return this.search.movies.result.includes(object);
        },
        // this function takes as input a rate based on a 0-to-10 scale and returns the corresponding number of full stars (based on a 0-to-5 scale)
        solidStars(vote) {
            return Math.round(vote / 2);
        },
        // this function takes as input a rate based on a 0-to-10 scale and returns the corresponding number of empty stars (based on a 0-to-5 scale)
        regularStars(vote) {
            return 5 - this.solidStars(vote);
        },
        // this function checks if both the search of the movies and the search of the tv series is completed
        isSearchCompleted() {
            return this.search.movies.loaded && this.search.tvSeries.loaded;
        },
        // this function checks whether the search of the movies or the search of the tv series is ongoing
        isSearching() {
            return this.search.movies.isLoading || this.search.tvSeries.isLoading;
        },
        // this function takes as input the poster_path of a movie/tv-series object
        // and returns a complete img-url that unables us to display the poster of this movie/tv-series
        getPoster(posterPath) {
            if (posterPath) {
                return this.posterUrl.baseUrl + this.posterUrl.posterSize + posterPath;
            } else {
                return this.posterUrl.defaultUrl;
            }
        },
        // this function takes as input the original_language of a movie/tv-series object
        // and returns a complete img-url that unables us to display the flag corresponding to the language
        getFlag(flagPath) {
            return 'img/flags/' + flagPath + '.png';
        },
        // this function takes as input an array of numbers corresponding to genre ids
        // the function returns the list of the genre names corresponding to these genre ids
        getGenreNames(genreIds) {
            // we create the variable which will contain the list of the genre names
            let genres = [];
            genreIds.forEach((genreId) => {
                let genreFound = false;
                let i = 0;
                while (!genreFound && i<this.genres.all.length) {
                    if (genreId == this.genres.all[i].id) {
                        // for each genre id, we check if it corresponds to an element of genres.all (which is the array containing all the genres)
                        // if it corresponds, we push the corresponding name in the array genres
                        genres.push(this.genres.all[i].name);
                        genreFound = true;
                    }
                    i++;
                }
            });
            return genres;
        },
        // this function checks if every genre selected by the user in the filter-menu
        // is included in the list of genres associated with a specific movie/tv-series
        matchTheFilter(genreIds) {
            let genres = this.getGenreNames(genreIds);
            return this.genres.checked.every((checkedGenre) => genres.includes(checkedGenre));
        },
        // through the following function we can get all the available genres of the movies/tv-series
        // these genres are saved without duplicates in the array genres.all
        getAllGenres(url) {
            axios
                .get(url, {
                    params : {
                        api_key: apiKey
                    }
                })
                .then((responseObject) => {
                    responseObject.data.genres.forEach((genre) => {
                        if (!includesObject(this.genres.all, genre)) {
                            this.genres.all.push(genre);
                        }
                    });
                });
        }
    },

    mounted() {
        axios
            .get(urlConfig, {
                params: {
                    api_key: apiKey
                }
            })
            .then((responseObject) => {
                this.posterUrl.baseUrl = responseObject.data.images.base_url;
            });

        this.getAllGenres(urlMovieGenres);

        this.getAllGenres(urlTvGenres);
    }
});


// this function checks if two objects are equal, that is, if they have the same key-value pairs
// (but the key-value pairs must also occur in the same order, otherwise the function returns false)
function areEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
// this function checks if an array of objects includes a given object
// (i.e. if a given object is equal to one of the objects occurring in the array)
function includesObject(array, obj) {
    let objFound = false;
    let i = 0;
    while (!objFound && i<array.length) {
        if (areEqual(obj, array[i])) {
            objFound = true;
        }
        i++;
    }
    return objFound;
}
