define(['viewManager'], function (ViewManager) {
    return ViewManager.extend({
        events: {
            'click #login': 'login',
            'keypress #password': 'passwordKeypress'
        },
        socketEvents: {
            'auth:login': '_login',
            'auth:logout': '_logout',
            'auth:wrongCredentials': '_wrongCredentials'
        },
        render: function() {
            var data = {title: 'Index'};
            this.$el.addClass('content');
            this.$el.append(this.template(data));
            this.appEvents.trigger('content', 'auth', this, this.$el);
            this.appEvents.trigger('socket', 'auth', 'update');
            return this;
        },
        login: function() {
            var username = this.$('#username').val();
            var password = this.$('#password').val();
            this.appEvents.trigger('socket', 'auth', 'login', {
                username: username,
                password: password
            });
        },
        _login: function() {
            this.$('#username').val('');
            this.$('#password').val('');
            this.$el.parent().hide();
        },
        _logout: function() {
            this.$el.parent().show();
        },
        _wrongCredentials: function() {
            var self = this;
            this.$('.alert').css('opacity', 1);
            setTimeout(function() {
                self.$('.alert').css('opacity', 0);
            }, 2000);
        },
        passwordKeypress: function(e) {
            if (e.keyCode == 13) {
                this.login();
            }
        }
    });
});
