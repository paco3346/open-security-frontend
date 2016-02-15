define(['/js/app/views/door/view.js', 'backbone'], function (DoorView, Backbone) {
    return Backbone.View.extend({
        tagName: 'a',
        className: 'list-group-item door-list-entry',
        events: {
            'click': 'view'
        },
        initialize: function(options) {
            this.template = options.template;
            this.appEvents = options.appEvents;
            _(this).bindAll('render', 'view');
        },
        render: function() {
            var data = this.model.toJSON();
            if (!this.model.isEnabled()) {
                this.$el.addClass('disabled');
            }
            this.$el.append(this.template(data));
            return this;
        },
        view: function() {
            if (this.model.isEnabled()) {
                var doorView = new DoorView({model: this.model, appEvents: this.appEvents});
                this.appEvents.trigger('content', 'main', doorView, doorView.render().el);
            }
        }
    });
});
