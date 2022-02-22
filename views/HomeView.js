(function ($, exports) {
    function HomeView() {
        //this.$headingWelcomeText = $("#welcome-text");
        //this.$languageButtons = $(".language-button");

        this.elements = {
            "#welcome-text": "headingWelcome",
            ".language-button": "languageButtons",
        };
    }

    HomeView.prototype.render = function (cmd, parameter) {
        var self = this;
        var viewCommands = {
            // Refreshes all text strings (e.g. relevant after a language change)
            refreshTextStrings: function () {
                console.log("Home View - Refresh text strings");
                // parameter consists of key-value pairs
                let langStrings = parameter;
                for (let key in langStrings) {
                    $(`[data-text-key="${key}"]`).text(langStrings[key]);
                }
            },
            // Set up the local variables
            initView: function () {
                for (var key in self.elements) {
                    self[self.elements[key]] = $(key);
                }
            },
        };
        viewCommands[cmd]();
    };

    HomeView.prototype.bind = function (event, handler) {
        var self = this;
        if (event === "changeLanguage") {
            self["languageButtons"].each(function () {
                $(this).on("click", function () {
                    handler($(this).data("lang"));
                });
            });
        }
    };

    exports.app = exports.app || {};
    exports.app.HomeView = HomeView;
})(jQuery, window);
