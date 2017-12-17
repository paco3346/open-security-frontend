define(['backbone', 'jquery', 'handlebars', 'text!/templates/door/view.html', '/js/app/models/camera.js'], function (Backbone, $, Handlebars, Template, Camera) {
    return Backbone.View.extend({
        events: {
            'click .open-door': 'openDoor'
        },
        className: 'door',
        initialize: function(options) {
            this.appEvents = options.appEvents;
            _(this).bindAll('render', 'openDoor', 'playCameraFeed');
            this.camera = new Camera({id: this.model.get('camera_id')});
            this.listenTo(this.camera, 'change', this.playCameraFeed);
        },
        render: function() {
            this.template = Handlebars.compile(Template);
            var data = this.model.toJSON();
            this.$el.empty().append(this.template(data));
            var self = this;
            self.camera.fetch();
            return this;
        },
        openDoor: function() {
            if (this.model.isEnabled()) {
                this.appEvents.trigger('socket', 'door', 'open', {id: this.model.get('id')});
            }
        },
        playCameraFeed: function() {
            this.player = new EvoWsPlayer({
                emsIp: 'cameras.bellavistachurch.org',
                emsPort: 7446,
                streamName: this.camera.get('streamName'),
                videoTagId: 'video-feed',
                useSsl: true
            });
            this.player.play();
        }
    });
});
