define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    return Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            live_view_url: ''
        },
        url: 'cameras'
    });
});
