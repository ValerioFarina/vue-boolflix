const urlSearch = 'https://api.themoviedb.org/3/search/';
const urlConfig = 'https://api.themoviedb.org/3/configuration';
const apiKey = '8762c3f242ebc4064f2c46af1dbdebc0';
const urlMovie = 'https://api.themoviedb.org/3/movie/';
const urlTv = 'https://api.themoviedb.org/3/tv/'

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
        imgUrl : {
            baseUrl : '',
            posterSize : 'w342'
        },
        flagsAvailable : [
            'en',
            'it',
            'de',
            'es',
            'fr',
            'ja'
        ]
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
                                // we save in object.result[i] the informations about the first 5 members of the corresponding cast
                                object.result[index].cast = response.data.cast.slice(0, 5);
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
            return this.imgUrl.baseUrl + this.imgUrl.posterSize + posterPath;
        },
        // this function takes as input the original_language of a movie/tv-series object
        // and returns a complete img-url that unables us to display the flag corresponding to the language
        getFlag(flagPath) {
            return 'img/flags/' + flagPath + '.png';
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
            this.imgUrl.baseUrl = responseObject.data.images.base_url;
        });
    }
});
