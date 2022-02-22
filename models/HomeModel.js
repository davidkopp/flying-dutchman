(function (exports) {
    "use strict";

    /**
     * Creates a new Model instance and hooks up the storage.
     *
     * @constructor
     * @param {object} storage A reference to the client side storage class
     */
    function HomeModel(storage) {
        this.storage = storage;
    }

	/**
	 * Creates a new model for the home page
	 *
	 * @param {function} [callback] The callback to fire after the model is created
	 */
     HomeModel.prototype.create = function (title, callback) {
		title = title || '';
		callback = callback || function () {};

		var newItem = {
			title: title.trim(),
			completed: false
		};

		this.storage.save(newItem, callback);
	};

    /**
     * Finds and returns a model in storage. If no query is given it'll simply
     * return everything. If you pass in a string or number it'll look that up as
     * the ID of the model to find. Lastly, you can pass it an object to match
     * against.
     *
     * @param {string|number|object} [query] A query to match models against
     * @param {function} [callback] The callback to fire after the model is found
     *
     * @example
     * model.read(1, func); // Will find the model with an ID of 1
     * model.read('1'); // Same as above
     * //Below will find a model with foo equalling bar and hello equalling world.
     * model.read({ foo: 'bar', hello: 'world' });
     */
    HomeModel.prototype.read = function (query, callback) {
        var queryType = typeof query;
        callback = callback || function () {};

        if (queryType === "function") {
            callback = query;
            return this.storage.findAll(callback);
        } else if (queryType === "string" || queryType === "number") {
            query = parseInt(query, 10);
            this.storage.find({ id: query }, callback);
        } else {
            this.storage.find(query, callback);
        }
    };

    exports.app = exports.app || {};
    exports.app.HomeModel = HomeModel;
})(window);
