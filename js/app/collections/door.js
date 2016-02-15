define([
    'underscore',
    'backbone',
    '/js/app/models/door.js'
], function(_, Backbone, Door) {
    return Backbone.Collection.extend({
        model: Door,
        url: 'doors'
    });
});
