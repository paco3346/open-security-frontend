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
            videojs($('#video-feed', this.$el)[0], {techOrder: ['flash']}, function() {
                self.player = this;
                self.camera.fetch();
            });
            return this;
        },
        openDoor: function() {
            if (this.model.isEnabled()) {
                this.appEvents.trigger('socket', 'door', 'open', {id: this.model.get('id')});
            }
        },
        playCameraFeed: function() {
            this.player.src('rtmp://192.168.0.30/live/' + this.camera.get('live_view_url'));
            this.player.play();
        }
    });
});
