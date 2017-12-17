define([
        'viewManager',
        '/js/app/views/user/modify.js',
        '/js/app/views/user/add.js'
], function (ViewManager, ModifyView, AddView) {
    return ViewManager.extend({
        events: {
            'click #user-add': 'add',
            'click #user-modify': 'modify'
        },
        initialize: function() {

        },
        className: 'list-view',
        init: function(fetch) {
            this.appEvents.trigger('content', 'sidebar', this, this.$el, true);
            /*if (fetch) {
                this.collection.fetch();
            }*/
            this.render();
        },
        render: function() {
            var data = {title: 'index'};
            this.$el.append(this.template(data));
            return this;
        },
        add: function() {
            var addView = new AddView({model: this.model, appEvents: this.appEvents});
            this.appEvents.trigger('content', 'main', addView, addView.render().el);
        },
        modify: function() {
            var modifyView = new ModifyView({model: this.model, appEvents: this.appEvents});
            this.appEvents.trigger('content', 'main', modifyView, modifyView.render().el);
        }
    });
});
