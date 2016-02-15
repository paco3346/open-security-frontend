define(['backbone', 'jquery', 'handlebars', 'text!/templates/user/add.html'], function (Backbone, $, Handlebars, Template) {
    return Backbone.View.extend({
        className: 'user',
        initialize: function(options) {
            this.appEvents = options.appEvents;
            _(this).bindAll('render');
        },
        render: function() {
            this.template = Handlebars.compile(Template);
            this.$el.empty().append(this.template());
            return this;
        }
    });
});
