(function(){
    window.Book = Backbone.Model.extend({
        urlRoot: BOOK_API
    });

    window.Books = Backbone.Collection.extend({
        urlRoot: BOOK_API,
        model: Book, 

        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this,
                successWrapper = function(success){
                    return function(){
                        self._fetched = true;
                        success && success.apply(this, arguments);
                    };
                };
            options.success = successWrapper(options.success);
            this.fetch(options);
        },

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);

            if(model){
                options.success && options.success(model);
                return;
            }

            model = new Book({
                resource_uri: id
            });

            model.fetch(options);
        }
        

    });

    window.BookView = Backbone.View.extend({
        tagName: 'li',
        className: 'book',

        events: {
            'click .permalink': 'navigate'           
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        navigate: function(e){
            this.trigger('navigate', this.model);
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.bookTemplate(this.model.toJSON()));
            return this;
        }                                        
    });


    window.DetailApp = Backbone.View.extend({

        initialize: function(){
          _.bindAll(this, 'render', 'home', 'saveBook');    
        },

        events: {
            'click .home': 'home',
            'click .save': 'saveBook',
            'click .delete': 'deleteBook'
        },
        
        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        saveBook: function() {
            this.model.set({
                message: this.$("#message").val(),
                author:  this.$("#author").val(),
                flag:    this.$("#flag").val()
            });
            alert('Updated Successfully !');
            this.model.save();
        },
    

        deleteBook: function() {
        this.model.destroy({
        success: function () {


         alert('The Book has been Deleted, the page will now redirect to Home');

        window.location = "http://localhost:8000/"; 

        }});
        },

    

        render: function(){
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }                                        
    });

    window.InputView = Backbone.View.extend({
        events: {
            'click .book': 'createBook',
           
        },

        createBook: function(){
            var message = this.$('#message').val();
            var author =this.$("#author").val();
            var flag =this.$("#flag").val();
            if(message){
                this.collection.create({
                    message: message,
                    author: author,
                    flag: flag,
                });
                this.$('#message').val('');
            }

            
        }

    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(book){
            var view = new BookView({
                model: book
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        }

    });

    window.ListApp = Backbone.View.extend({
        el: "#app",

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },

        render: function(){
            $(this.el).html(ich.listApp({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#books')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
            new InputView({
                collection: this.collection,
                el: this.$('#input')
            });
        }        
    });

    
    window.Router = Backbone.Router.extend({
        routes: {
            '': 'list',
            ':id/': 'detail'
        },

        navigate_to: function(model){
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },

        detail: function(){},

        list: function(){}
    });

    $(function(){
        window.app = window.app || {};
        app.router = new Router();
        app.books = new Books();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.books
        });
        app.detail = new DetailApp({
            el: $("#app")
        });
        app.router.bind('route:list', function(){
            app.books.maybeFetch({
                success: _.bind(app.list.render, app.list)                
            });
        });
        app.router.bind('route:detail', function(id){
            app.books.getOrFetch(app.books.urlRoot + id + '/', {
                success: function(model){
                    app.detail.model = model;
                    app.detail.render();                    
                }
            });
        });

        app.list.bind('navigate', app.router.navigate_to, app.router);
        app.detail.bind('home', app.router.navigate_to, app.router);
        Backbone.history.start({
            pushState: true, 
            silent: app.loaded
        });
    });
})();