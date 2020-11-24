var app = new Vue({
    el: '#root',

    data: {
        searched : '',
        searchResult : [],
        baseUrl : '',
        loaded : false
    },

    methods: {
        getSearchResult() {
            axios
                .get('https://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: '8762c3f242ebc4064f2c46af1dbdebc0',
                        query: this.searched
                    }
                })
                .then((responseObject) => {
                    this.searchResult = responseObject.data.results;
                    this.loaded = true;
                });
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
