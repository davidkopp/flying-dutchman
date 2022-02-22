(function ($) {
    "use strict";

    /**
     * Sets up a new instance of the *Flying Dutchman*.
     *
     */
    function FlyingDutchman() {
        // TODO: Store
        //this.storage = new app.Store(name);
        //this.model = new app.HomeModel(this.storage);
        this.model = new app.HomeModel();
        this.view = new app.HomeView();
        this.controller = new app.HomeController(this.model, this.view);
    }

    function changeMVC() {
        // TODO: change controller, view and model accordingly to the current page#

        var self = this;

        var locationHash = document.location.hash;
        var route = locationHash.split("/")[1];
        var page = route || "";

        switch (page) {
            case "":
                self.model = new app.HomeModel();
                self.view = new app.HomeView();
                self.controller = new app.HomeController(self.model, self.view);
                break;

            default:
                console.error(`Unknown page '${page}'. Can't change view.`);
                break;
        }
    }

    function initView() {
        var self = this;
        self.controller.initView();
        self.changeMVC();
    }

    $(function () {
        var flyingDutchman = new FlyingDutchman();
        flyingDutchman.initView = initView;
        flyingDutchman.changeMVC = changeMVC;

        flyingDutchman.initView();
        //$("window").on("load", flyingDutchman.initView);
        $("window").on("hashchange", flyingDutchman.changeMVC);
    });
})(jQuery);
