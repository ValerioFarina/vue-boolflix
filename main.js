var app = new Vue({
    el: '#root',

    data: {
        searched : '',
        searchResult : [],
        baseUrl : ''
    },

    methods: {
        // this function populates the array "searchResult" with objects representing movies and tv series
        // according to the value of "searched" (which is the text written by the user in the input)
        getSearchResult() {
            // we reset the value of "searchResult"
            this.searchResult = [];
            // if the input inserted by the user is not an empty string, we make the API calls we need
            if (this.searched != '') {
                // we get the movies that match the search made by the user
                axios
                    .get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched
                        }
                    })
                    .then((responseObject) => {
                        // we add the movies to the array "searchResult"
                        this.searchResult = [...this.searchResult, ...responseObject.data.results];
                    });

                // we get the tv shows that match the search made by the user
                axios
                    .get('https://api.themoviedb.org/3/search/tv', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched
                        }
                    })
                    .then((responseObject) => {
                        // we add the tv shows to the array "searchResult"
                        this.searchResult = [...this.searchResult, ...responseObject.data.results];
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
