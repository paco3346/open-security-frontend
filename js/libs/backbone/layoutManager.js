define(['backbone', 'handlebars', 'bootstrap'],
    function (Backbone, Handlebars) {
        var LayoutManager = Backbone.View.extend({
            el: document.body,
            viewDomElements: {},
            init: function() {
                var self = this;
                this.children = {};
                this.appEvents.on('content', function(domEl, view, el) {
                    if (self.viewDomElements[domEl] != undefined) {
                        console.log('removing', self.viewDomElements[domEl]);
                        self.viewDomElements[domEl].remove();
                    }
                    self.viewDomElements[domEl] = view;
                    self.$('#' + domEl).empty().append(el);
                });
                require(['text!templates/layout/' + this.options.layout + '.html'], function(Template) {
                    self.template = Handlebars.compile(Template);
                    self.render();
                });
            },
            constructor: function(options, appEvents) {
                this.options = options;
                this.appEvents = appEvents;
                this.init();
                Backbone.View.apply(this, arguments);
            },
            render: function() {
                this.$el.append(this.template());
                var self = this;
                //foreach layout element (main, header, footer, etc)
                _.each(this.options, function(value, index) {
                    //only actually fill in content and layout, the rest are sub elements rendered by one of these 2
                    if (['content', 'layout'].indexOf(index) == -1) {
                        //get the view controller
                        require(['js/app/views/layout/' + value], function(View) {
                            var view = new View;
                            //magically get and compile the templates
                            view._init(['layout', value], self.appEvents, value, function() {
                                //bind socketEvents for views so they don't have to do it themselves
                                if (view.socketEvents != undefined) {
                                    _.each(view.socketEvents, function(method, event) {
                                        var parts = event.split(':');
                                        self.appEvents.trigger('createSocketListener', parts[0], parts[1]);
                                        self.appEvents.on('socket:' + event, function(data) {
                                            if (view[method] != undefined) {
                                                view[method](data);
                                            }
                                        });
                                    });
                                }
                                if (view.init != undefined) {
                                    view.init();
                                } else {
                                    view.render();
                                }
                            });
                            self.children[index] = view;
                        });
                    }
                });
            }
        });
        Backbone.LayoutManager = LayoutManager;
        return LayoutManager;
    }
);
