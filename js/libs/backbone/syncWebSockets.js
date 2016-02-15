define([], function() {
    var SyncWebSockets = function(appEvents) {
        this.callbacks = [];
        this.appEvents = appEvents;
        this.appEvents.trigger('createSocketListener', 'db', 'result');

        this.sync = function(method, model, options) {
            console.log('getting data');
            console.log("model", model);
            console.log(options);
            var uid = (new Date).getTime();
            this.callbacks[uid] = {
                model: model,
                options: options
            };
            setTimeout(function() {
                if (this.callbacks[uid] != undefined) {
                    this.callbacks[uid] = null;
                }
            }.bind(this), 3000);

            var queryObject = {
                model: model.url,
                uid: uid,
                returnCollection: true
            };

            if (model.get('id')) {
                queryObject.id = model.get('id');
                queryObject.returnCollection = false;
            }

            this.appEvents.trigger('socket', 'db', method, queryObject);
        }.bind(this);

        this.callbackHandler = function(data) {
            if (this.callbacks[data.uid] != undefined) {
                var request = this.callbacks[data.uid];
                request.options.success(data.data);
                request.model.trigger('fetch');
                this.callbacks[data.uid] = null;
            }
        }.bind(this);

        this.appEvents.on('socket:db:result', this.callbackHandler);
    };
    return SyncWebSockets;
});
