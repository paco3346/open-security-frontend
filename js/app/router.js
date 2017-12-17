define([
    'underscore',
    'backbone',
    'handlebars'
], function(_, Backbone, Handlebars) {
    var Router = Backbone.Router.extend({
        routes: {
            '*actions': 'default'
        },
        'default': function(args) {
            var self = this;
            if (args != undefined) {
                args = args.split('/');
            } else {
                args = ['index', 'index'];
            }
            var module = args[0] || 'index';
            var action = args[1] || 'index';
            //load the controller
            require(['js/app/views/' + module + '/' + action], function(View) {
                var view = new View;
                //auto get and compile the main $el template
                view._init([module, action], self.appEvents, self.contentElId, function() {
                    if (view.socketEvents != undefined) {
                        //bind socketEvents for views so they don't have to do it themselves
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
                    //prep a callback if there are other subviews
                    var callback = function() {
                        if (view.init != undefined) {
                            view.init(self.app.auth.loggedIn());
                        } else {
                            view.render(self.app.auth.loggedIn());
                        }
                    };
                    //each view is required to have a main el, this array automagically loads any other templates it may need
                    if (view.templates != undefined) {
                        var numExpectedCallbacks = Object.keys(view.templates).length;
                        var numCallbacks = 0;
                        _.each(view.templates, function(template, el) {
                            require(['text!templates/' + template + '.html'], function(Template) {
                                view._templates = {};
                                view._templates[el] = Handlebars.compile(Template);
                                numCallbacks++;
                                if (numCallbacks == numExpectedCallbacks) {
                                    callback();
                                }
                            }, function(e) {
                                numCallbacks++;
                                if (numCallbacks == numExpectedCallbacks) {
                                    callback();
                                }
                            });
                        });
                    } else {
                        //finally, hand it off to the view
                        callback();
                    }
                });
            }, function(e) {
                console.log(e);
                require(['js/app/views/layout/404'], function(View) {
                    var view = new View;
                    view._init('layout/404', self.appEvents, self.contentElId, function() {
                        view.render();
                    });
                });
            });
        },
        constructor: function(app, contentElId) {
            this.appEvents = app.appEvents;
            this.app = app;
            this.contentElId = contentElId;
            Backbone.Router.apply(this, arguments);
        }
    });

    var initialize = function(appEvents, contentElId) {
        return new Router(appEvents, contentElId);
    };
    return {
        initialize: initialize
    }
});
