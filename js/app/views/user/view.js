define(['viewManager'], function (ViewManager) {
    return ViewManager.extend({
        initialize: function() {

        },
        render: function() {
            var data = {title: 'test'};
            this.$el.append(this.template(data));
            this.appEvents.trigger('content', 'main', this, this.$el);
            return this;
        }
    });
});
