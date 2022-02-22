(function (exports) {
    //var homeController = Controller.create({
    function HomeController(model, view) {
        var self = this;
        self.model = model;
        self.view = view;
        self.viewName = "home";

        self.view.render("initView");
        self.view.bind("changeLanguage", function (newLang) {
            self.changeLanguage(newLang);
        });
    }

    /**
     * Changes the language and updates the view accordingly
     *
     * @param {string} newLang The new language as the country code
     */
    HomeController.prototype.changeLanguage = function (newLang) {
        var self = this;
        // TODO: Global model
        Dictionary.setLanguage(newLang);
        self.view.render(
            "refreshTextStrings",
            Dictionary.getAllStringsForView(self.viewName)
        );
    };

    /**
     * An event to fire on load.
     * Will display all strings in the configured language.
     */
    HomeController.prototype.initView = function () {
        console.log("HomeController - Initialize View");
        var self = this;
        // self.model.read(function (data) {
        //     self.view.render("initView", data);
        // });
        self.view.render("initView");
        self.view.render(
            "refreshTextStrings",
            Dictionary.getAllStringsForView(self.viewName)
        );
    };

    /**
     * Loads and initialises the view
     *
     * @param {string} '' | 'active' | 'completed'
     */
    /*
     HomeController.prototype.setView = function (locationHash) {
        var route = locationHash.split("/")[1];
        var page = route || "";
        //this._updateFilterState(page);
    };*/

    exports.app = exports.app || {};
    exports.app.HomeController = HomeController;
})(window);
