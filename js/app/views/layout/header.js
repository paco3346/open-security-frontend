define(['viewManager', 'backbone'], function (ViewManager, Backbone) {
    return ViewManager.extend({
        events: {
            'click #menu-logout': 'logout',
            'click #menu-doors': 'doors',
            'click #menu-users': 'users'
        },
        render: function() {
            var data = {title: 'Index'};
            this.$el.append(this.template(data));
            this.$el.addClass('content');
            this.appEvents.trigger('content', 'header', this, this.$el);
            return this;
        },
        logout: function(){
            this.appEvents.trigger('socket', 'auth', 'logout');
        },
        doors: function() {
            Backbone.history.navigate('door', {trigger: true});
        },
        users: function() {
            Backbone.history.navigate('user', {trigger: true});
        }
    });
});
