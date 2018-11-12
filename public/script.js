var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    el: "#app",
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
        //imgSrc: items.link
    },
    mounted: function () {
        this.onSubmit();

        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function () {
            console.log('entered viewport');
            vueInstance.appendItems();
        });
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    methods: {
        appendItems: function () {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }

        },
        onSubmit: function () {
            this.loading = true;
            this.items = [];
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function (res) {
                    this.lastSearch = this.newSearch;
                    this.results = res.data;
                    this.appendItems();
                    this.loading = false;
                });
        },
        addItem: function (index) {
            this.total += PRICE;
            var item = this.items[index];
            var found = false;

            for (var i = 0; i < this.cart.length; i++) {
                // if its already there
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }

            // if not found
            if (!found) {
                console.log('if not');
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },

        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },

        dec: function (item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                    }
                }
            }
        }

    }

});


