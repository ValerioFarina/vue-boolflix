const urlSearch = 'https://api.themoviedb.org/3/search/';
const urlConfig = 'https://api.themoviedb.org/3/configuration';
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
                url : urlSearch + 'movie'
            },
            tvSeries : {
                result : [],
                loaded : false,
                isLoading: false,
                url : urlSearch + 'tv'
            },
            numberOfResults : 0
        },
        imgUrl : {
            baseUrl : '',
            posterSize : 'w342'
        },
        languages : [
            'en',
            'it',
            'de',
            'es',
            'fr',
            'ja'
        ]
    },

    methods : {
        // this function takes as input either the string "movies" or the string "tvSeries"
        // in the first case, it populates the array search.movies.result with objects representing movies
        // in the second case, it populates the array search.tvSeries.result with objects representing tv series
        startSearch(objects) {
            // we reset the value of loaded
            this.search[objects].loaded = false;
            // we set the value of isLoading equal to true
            this.search[objects].isLoading = true;
            // we reset the value of numberOfResults
            this.search.numberOfResults = 0;
            axios
                // we get the movies/tv-series that match the search made by the user
                .get(this.search[objects].url, {
                    params: {
                        api_key: apiKey,
                        query: this.searched.title
                    }
                })
                .then((responseObject) => {
                    // we add the movies/tv-series to the corresponding array
                    this.search[objects].result = responseObject.data.results;
                    // we add to numberOfResults the number of movies/tv series we have obtained
                    this.search.numberOfResults += this.search[objects].result.length;
                    // we reset the value of isLoading
                    this.search[objects].isLoading = false;
                    // we set the value of loaded equal to true
                    this.search[objects].loaded = true;
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
                this.startSearch('movies');
                // we populate the array search.tvSeries.result with objects representing tv series according to the search made by the user
                this.startSearch('tvSeries');
            }
        },
        // this function checks if an object represents a movie or a tv series
        isMovie(object) {
            return this.search.movies.result.includes(object);
        },
        // this function converts a rate based on a 0-to-10 scale into a rate based on a 0-to-5 scale
        toStars(vote) {
            return Math.round(vote / 2);
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
        getImgUrl(posterPath) {
            return this.imgUrl.baseUrl + this.imgUrl.posterSize + posterPath;
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
