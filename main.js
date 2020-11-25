const urlMovie = 'https://api.themoviedb.org/3/search/movie';
const urlTv = 'https://api.themoviedb.org/3/search/tv';
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
                isLoading : false
            },
            tvSeries : {
                result : [],
                loaded : false,
                isLoading: false
            }
        },
        imgUrl : {
            baseUrl : '',
            posterSize : 'w342'
        }
    },

    methods : {
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
                // we reset the values of search.movies.loaded and search.tvSeries.loaded
                this.search.movies.loaded = false;
                this.search.tvSeries.loaded = false;
                // we set search.movies.isLoading and search.tvSeries.isLoading equal to true
                this.search.movies.isLoading = true;
                this.search.tvSeries.isLoading = true;
                // we get the movies that match the search made by the user
                axios
                    .get(urlMovie, {
                        params: {
                            api_key: apiKey,
                            query: this.searched.title
                        }
                    })
                    .then((responseObject) => {
                        // we add the movies to the array search.movies.result
                        this.search.movies.result = responseObject.data.results;
                        // we reset the value of search.movies.isLoading
                        this.search.movies.isLoading = false;
                        // we set the value of search.movies.loaded equal to true
                        this.search.movies.loaded = true;
                    });

                // we get the tv series that match the search made by the user
                axios
                    .get(urlTv, {
                        params: {
                            api_key: apiKey,
                            query: this.searched.title
                        }
                    })
                    .then((responseObject) => {
                        // we add the tv series to the array search.tvSeries.result
                        this.search.tvSeries.result = responseObject.data.results;
                        // we reset the value of search.tvSeries.isLoading
                        this.search.tvSeries.isLoading = false;
                        // we set the value of search.tvSeries.loaded equal to true
                        this.search.tvSeries.loaded = true;
                    });
            }
        },
        // this function converts a rate based on a 0-to-10 scale into a rate based on a 0-to-5 scale
        toStars(vote) {
            return Math.round(vote / 2);
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
