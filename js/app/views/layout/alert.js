define(['viewManager', 'backbone'], function (ViewManager, Backbone) {
    return ViewManager.extend({
        socketEvents: {
            'door:alert': 'playAlert'
        },
        init: function() {
            this.sound = new Audio('/media/alert_27.mp3');
        },
        render: function() {
            return this;
        },
        playAlert: function() {
            console.log('test');
            this.sound.play();
        }
    });
});
