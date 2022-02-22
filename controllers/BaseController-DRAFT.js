(function ($, exports) {
    var module = {};

    /**
     * Create a new controller instance.
     *
     * @param {Object}  includes    Object(s) that are added to the controller.
     */
    module.create = function (includes) {
        var baseController = function () {
            this.initializer.apply(this, arguments);
            this.init.apply(this, arguments);
        };

        /**
         * Initialization function that is called upon instantiation of the controller.
         *
         * It is empty for the base controller.
         * However, controllers are encouraged to overwrite it.
         */
        baseController.prototype.init = function () {};

        /**
         * Executes a given function in the local context.
         *
         * This can be useful for event callbacks.
         *
         * @param {function} func Function that will executed.
         * @returns The return value of the given function.
         */
        baseController.proxy = function (func) {
            return $.proxy(func, this);
        };
        baseController.prototype.proxy = baseController.proxy;

        /**
         * Include function adds a property onto the prototype of the controller.
         *
         * @param {Object} object Object to add
         */
        baseController.include = function (object) {
            $.extend(this.fn, object);
        };

        /**
         * Extend function adds a property onto the controller.
         *
         * @param {Object} object Object to add
         */
        baseController.extend = function (object) {
            $.extend(this, object);
        };

        baseController.include({
            /**
             * Initializer function for setup the delegation of events.
             *
             * @param {Object} options Options to use
             */
            initializer: function (options) {
                this.options = options;

                for (var key in this.options) this[key] = this.options[key];

                if (this.events) this.delegateEvents();
                if (this.elements) this.refreshElements();
            },

            $: function (selector) {
                return $(selector, this.el);
            },

            refreshElements: function () {
                for (var key in this.elements) {
                    this[this.elements[key]] = this.$(key);
                }
            },

            eventSplitter: /^(\w+)\s*(.*)$/,

            delegateEvents: function () {
                for (var key in this.events) {
                    var methodName = this.events[key];
                    var method = this.proxy(this[methodName]);

                    var match = key.match(this.eventSplitter);
                    var eventName = match[1],
                        selector = match[2];

                    if (selector === "") {
                        this.el.bind(eventName, method);
                    } else {
                        this.el.delegate(selector, eventName, method);
                    }
                }
            },
        });

        if (includes) baseController.include(includes);

        return baseController;
    };

    exports.Controller = module;
})(jQuery, window);
