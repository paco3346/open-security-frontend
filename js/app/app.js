define(['router', 'backbone', 'auth', 'layoutManager', 'syncWebSockets'], function(Router, Backbone, Auth, LayoutManager, SyncWebSockets) {
    var initialize = function(config) {
        this.config = config;
        this.appEvents = _.extend({}, Backbone.Events);
        this.router = Router.initialize(this, this.config.layout.content);
        Backbone.history.start();
        this.auth = new Auth({
            location: 'http://' + window.location.host + ':81',
            appEvents: this.appEvents
        });
        var syncWebSockets = new SyncWebSockets(this.appEvents);
        Backbone.sync = syncWebSockets.sync;
        this.LayoutManager = new LayoutManager(this.config.layout, this.appEvents);
    };

    return {
        initialize: initialize
    };
});
