define([
    'viewManager',
    '/js/app/collections/door.js',
    '/js/app/views/door/listEntry.js'
], function (ViewManager, DoorCollection, DoorView) {
    return ViewManager.extend({
        templates: {
            listEntry: 'door/listEntry'
        },
        socketEvents: {
            'auth:login': '_login',
            'auth:logout': '_logout'
        },
        initialize: function() {
            _(this).bindAll('render', 'renderSidebar', '_login', '_logout');
            this.collection = new DoorCollection();
            this.collection.bind('fetch', this.renderSidebar);
            this.subViews = [];
        },
        init: function(fetch) {
            this.$sidebar = $('<div></div>').addClass('list-view');
            this.appEvents.trigger('content', 'sidebar', this, this.$sidebar, true);
            this.appEvents.trigger('content', 'main', this, this.$el);
            if (fetch) {
                this.collection.fetch();
            }
            this.render();
        },
        render: function() {
            this.$el.empty().append(this.template());
        },
        renderSidebar: function() {
            this.subViews.forEach(function(subview) {
                subview.remove();
            });
            this.subViews = [];
            this.collection.sortBy('name').forEach(function(door) {
                var view = new DoorView({model: door, template: this._templates['listEntry'], appEvents: this.appEvents});
                this.$sidebar.append(view.render().el);
                this.subViews.push(view);
            }.bind(this));
            return this;
        },
        _login: function() {
            this.collection.fetch();
        },
        _logout: function() {
            _.each(this.subViews, function(subView) {
                subView.remove();
            });
            this.collection.reset();
        }
    });
});
