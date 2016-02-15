define(['viewManager'], function (ViewManager) {
    return ViewManager.extend({
        render: function() {
            this.$el.empty().append(this.template());
            this.appEvents.trigger('content', this.domEl, this, this.$el);
            return this;
        }
    });
});
