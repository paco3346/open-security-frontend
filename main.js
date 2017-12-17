require.config({
    paths: {
        jquery: 'js/libs/jquery/jquery',
        bootstrap: 'js/libs/bootstrap/bootstrap',
        underscore: 'js/libs/underscore/underscore',
        backbone: 'js/libs/backbone/backbone',
        handlebars: 'js/libs/handlebars/handlebars',
        text: 'js/libs/require/text',
        app: 'js/app/app',
        router: 'js/app/router',
        auth: '/js/app/auth',
        less: 'js/libs/less/less',
        viewManager: '/js/libs/backbone/viewManager',
        layoutManager: '/js/libs/backbone/layoutManager',
        socketio: [
            'http://' + window.location.host + ':1081/socket.io/socket.io',
            '/js/libs/socketio/socket.io' //fallback
        ],
        jscookie: '/js/libs/jscookie/jscookie',
        syncWebSockets: '/js/libs/backbone/syncWebSockets',
    },
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        bootstrap: {
            deps: ['jquery']
        },
        routemanager: {
            deps: ['jquery', 'backbone', 'underscore']
        },
    }
});

var layout = {
    layout: 'layout1',
    content: 'main',
    header: 'header',
    footer: 'footer',
    sidebar: 'sidebar',
    auth: 'auth',
    alert: 'alert'
};

require(['js/app/app'], function(App) {
    App.initialize({layout: layout});
    window.App = App;
});
