define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    return Backbone.Model.extend({
        defaults: {
            id: 1,
            name: ''
        },
        isEnabled: function() {
            return this.get('enabled') == true;
        }
    });
});
