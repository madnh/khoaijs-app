(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'lodash', 'khoaijs-event-emitter'], function (require, _, EventEmitter) {
            var module = factory(_, EventEmitter);

            if (require.specified('khoaijs')) {
                require(['khoaijs'], function (Khoai) {
                    Khoai.App = module;
                });
            }

            root.App = module;

            return module;
        });
    } else {
        var _ = root._;
        var App = factory(
            root._,
            root.Khoai && root.Khoai.EventEmitter || root.EventEmitter
        );

        /**
         * Support App from https://gist.github.com/madnh/53a16ae3842e16815c0fd36283843a9b
         * @type {*}
         */
        var old_app = root.App || null;

        if (old_app) {
            if (old_app.init_callbacks && _.isArray(old_app.init_callbacks) && old_app.init_callbacks.length) {
                _.each(old_app.init_callbacks, function (cb) {
                    App.onInit(cb);
                });

                old_app.init_callbacks = [];
                delete old_app.init_callbacks;
            }

            App = _.defaults(App, _.omit(old_app, 'init_callbacks'));
        }

        if (root.Khoai) {
            root.Khoai.App = App;
        }

        root.App = App;
    }
}(this, function (_, EventEmitter) {
    function App() {
        EventEmitter.call(this);

        this.private('init');
    }

    App.prototype = Object.create(EventEmitter.prototype);
    App.prototype.constructor = App;

    /**
     * Option this app
     * @param {string|{}} option
     * @param {*} value
     * @param {string} [separator='.']
     */
    App.prototype.option = function (option, value, separator) {
        separator = separator || '.';

        if (_.isObject(option)) {
            var invalid_options, self = this;

            invalid_options = _.pick(option, function (value, key) {
                return (key + '')[0] === '_' || _.isFunction(value);
            });

            if (!_.isEmpty(invalid_options)) {
                console.warn('Invalid App options: ' + Object.keys(invalid_options).join(', '));
            }

            var options = _.omit(option, Object.keys(invalid_options));

            _.each(options, function (option, value) {
                self.option(option, value, separator);
            });

            return this;
        }

        var deep = (option + '').split(separator || '.');

        if (deep[0][0] === '_') {
            console.warn('Invalid App options: ' + deep[0][0]);
        }

        _.set(this, deep, value);

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {number} [priority = 500]
     */
    App.prototype.onInit = function (callback, priority) {
        this.addOnceListener('init', callback, {
            priority: priority || 500
        });

        return this;
    };

    /**
     * Init App
     */
    App.prototype.init = function () {
        this.emitEvent('init');
        this.resetEvents('init');
    };

    return new App();
}));