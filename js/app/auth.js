define(['socketio', 'jscookie'], function (io, Cookies) {
    var Auth = function(options) {
        this.location = options.location;
        this.sockets = {};
        this.setupNamespace('auth');
        var self = this;
        this.sockets['auth']['socket'].on('login', function() {
            self._loggedIn = true;
            self.updateAllNamespaceCookies();
        });
        this.sockets['auth']['socket'].on('logout', function() {
            self._loggedIn = false;
        });
        this.appEvents = options.appEvents;
        this._loggedIn = false;

        this.appEvents.on('socket', function(namespace, command, data) {
            self.setupNamespace(namespace);
            self.sockets[namespace]['socket'].emit(command, data);
        });

        this.appEvents.on('createSocketListener', function(namespace, listener) {
            self.setupListener(namespace, listener);
        });

        this.sockets['auth']['socket'].on('connect', function() {
            self.sockets['auth']['socket'].emit('cookie', 'session', Cookies.get('session'));
        });
        this.sockets['auth']['socket'].on('cookie', function(key, value) {
            Cookies.set(key, value);
        });
    };

    Auth.prototype.setupNamespace = function(namespace) {
        var self = this;
        if (self.sockets[namespace] == undefined) {
            self.sockets[namespace] = {
                socket: io.connect(self.location + '/' + namespace),
                listeners: []
            };
            self.updateNamespaceCookie(namespace);
        }
    };

    Auth.prototype.updateNamespaceCookie = function (namespace) {
        this.sockets[namespace].socket.emit('cookie', Cookies.get('session'));
    };

    Auth.prototype.updateAllNamespaceCookies = function () {
        for (var namespace in this.sockets) {
            this.updateNamespaceCookie(namespace);
        }
    };

    Auth.prototype.setupListener = function(namespace, listener) {
        var self = this;
        if (self.sockets[namespace] == undefined) {
            self.setupNamespace(namespace);
        }
        if (self.sockets[namespace].listeners[listener] == undefined) {
            self.sockets[namespace].listeners[listener] = true;
            self.sockets[namespace]['socket'].on(listener, function(data) {
                console.log('socket' + ':' + namespace + ':' + listener, data);
                self.appEvents.trigger('socket' + ':' + namespace + ':' + listener, data);
            });
        }
    };

    Auth.prototype.loggedIn = function() {
        return this._loggedIn;
    };
    return Auth;
});
