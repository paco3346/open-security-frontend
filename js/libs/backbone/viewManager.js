define(['backbone', 'handlebars'],
    function (Backbone, Handlebars) {
        var ViewManager = Backbone.View.extend({
            _init: function(args, appEvents, domEl, callback) {
                this.appEvents = appEvents;
                this.domEl = domEl;
                var self = this;
                if (typeof args === 'object') {
                    var module = args[0];
                    var action = args[1];
                    require(['text!templates/' + module + '/' + action + '.html'], function(Template) {
                        self.template = Handlebars.compile(Template);
                        callback();
                    });
                } else {
                    require(['text!templates/' + args + '.html'], function(Template) {
                        self.template = Handlebars.compile(Template);
                        callback();
                    });
                }
            }
        });
        Backbone.ViewManager = ViewManager;
        return ViewManager;
    }
);
