define(['backbone', 'handlebars', 'bootstrap'],
    function (Backbone, Handlebars) {
        var LayoutManager = Backbone.View.extend({
            el: document.body,
            viewDomElements: {},
            init: function() {
                var self = this;
                this.children = {};
                this.appEvents.on('content', function(domEl, view, el, animation) {
                    self.updateContent(domEl, view, el, animation)
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
            },
            updateContent: function(domEl, view, el, animation) {
                var self = this;
                var container = self.$('#' + domEl);
                if (animation) {
                    var width = container.width();
                    container.css('transition', 'margin-left 0.3s');
                    container.css('margin-left', -1 * width);
                    setTimeout(function() {
                        self._updateContent(container, domEl, view, el);
                        container.css('margin-left', 0);
                    }, 300);
                } else {
                    this._updateContent(container, domEl, view, el);
                }
            },
            _updateContent: function(container, domEl, view, el) {
                var self = this;
                if (self.viewDomElements[domEl] != undefined) {
                    self.viewDomElements[domEl].remove();
                }
                self.viewDomElements[domEl] = view;
                container.empty().append(el);
            }
        });
        Backbone.LayoutManager = LayoutManager;
        return LayoutManager;
    }
);
