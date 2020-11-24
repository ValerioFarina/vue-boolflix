var app = new Vue({
    el: '#root',

    data: {
        searched : '',
        searchResult : [],
        baseUrl : ''
    },

    methods: {
        getSearchResult() {
            this.searchResult = [];
            if (this.searched != '') {
                axios
                    .get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched
                        }
                    })
                    .then((responseObject) => {
                        this.searchResult = [...this.searchResult, ...responseObject.data.results];
                        this.moviesLoaded = true;
                    });

                axios
                    .get('https://api.themoviedb.org/3/search/tv', {
                        params: {
                            api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                            query: this.searched
                        }
                    })
                    .then((responseObject) => {
                        this.searchResult = [...this.searchResult, ...responseObject.data.results];
                        this.tvSeriesLoaded = true;
                    });
            }
        },

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
