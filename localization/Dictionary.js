(function ($, exports) {
    var language = "en";

    // ==========================================================================
    // The dictionary consists of a simple JSON structure. It also keeps
    // track of the different keys that are available  for IDs.
    //
    var dict = {
        // TODO: Store the set of strings in a JSON file for each language to be loaded on request.
        home: {
            en: {
                hello_text: "Welcome to Flying Dutchman",
            },
            de: {
                hello_text: "Willkommen zum Flying Dutchman",
            },
            pt: {
                hello_text: "Bemvindo ao Flying Dutchman",
            },
        },
    };

    // This function will return the appropriate string for each
    // key in the given view.
    function getString(view, key) {
        return dict[view][language][key];
    }

    // This function returns all strings for a given view.
    function getAllStringsForView(view) {
        return dict[view][language];
    }

    function getCurrentLanguage() {
        return language;
    }

    function setLanguage(newLang) {
        language = newLang;
    }

    exports.Dictionary = {
        getString: getString,
        getAllStringsForView: getAllStringsForView,
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
    };
})(jQuery, window);
