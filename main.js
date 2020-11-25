var app = new Vue({
    el : '#root',

    data : {
        searched : {
            input : '',
            title : ''
        },
        searchResult : {
            movies : [],
            tvSeries : []
        },
        loaded : {
            movies : false,
            tvSeries : false
        },
        baseUrl : ''
    },

    methods : {
        // this function populates the array searchResult.movies with objects representing movies
        // and the array searchResult.tvSeries with objects representing tv series
        // according to the value of searched.input (which is the text written by the user in the input)
        getSearchResult() {
            if (this.searched.input.trim() != '') {
                // if the input inserted by the user is not an empty string
                // we save in searched.title the value of searched.input
                this.searched.title = this.searched.input.trim();
                // we reset the value of searched.input
                this.searched.input = '';
                // we reset the values of loaded.movies and loaded.tvSeries
                this.loaded.movies = false;
                this.loaded.tvSeries = false;
                // we get the movies that match the search made by the user
                axios
                    .get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched.title
                        }
                    })
                    .then((responseObject) => {
                        // we add the movies to the array searchResult.movies
                        this.searchResult.movies = responseObject.data.results;
                        // we set loaded.movies equal to true
                        this.loaded.movies = true;
                    });

                // we get the tv series that match the search made by the user
                axios
                    .get('https://api.themoviedb.org/3/search/tv', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched.title
                        }
                    })
                    .then((responseObject) => {
                        // we add the tv series to the array searchResult.tvSeries
                        this.searchResult.tvSeries = responseObject.data.results;
                        // we set loaded.tvSeries equal to true
                        this.loaded.tvSeries = true;
                    });
            }
        },
        // this function converts a rate based on a 0-to-10 scale into a rate based on a 0-to-5 scale
        toStars(vote) {
            return Math.round((vote * 5) / 10);
        }
    },

    mounted() {
        axios
        .get('https://api.themoviedb.org/3/configuration', {
            params: {
                api_key: '8762c3f242ebc4064f2c46af1dbdebc0'
            }
        })
        .then((responseObject) => {
            this.baseUrl = responseObject.data.images.base_url;
        });
    }
});
