define(['viewManager'], function (ViewManager) {
    return ViewManager.extend({
        render: function() {
            var data = {title: 'Index'};
            this.$el.append(this.template(data));
            this.appEvents.trigger('content', 'main', this, this.$el);
            return this;
        }
    });
});
