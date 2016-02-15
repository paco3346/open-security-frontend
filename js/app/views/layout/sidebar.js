define(['viewManager'], function (ViewManager) {
    return ViewManager.extend({
        render: function() {
            var data = {title: 'Index'};
            this.$el.append(this.template(data));
            return this;
        }
    });
});
