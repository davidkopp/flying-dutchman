/*
 * File: LanguageController.js
 *
 * Controller that is responsible for changing the language and updating the view accordingly.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Thursday, 24th February 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /**
     * Changes the language for the whole system and updates the view automatically.
     *
     * @param {string} new_lang The new language in country codes
     */
    function changeLang(new_lang) {
        switch (new_lang) {
            case "en":
                Dictionary.setLanguage("en");
                break;
            case "de":
                Dictionary.setLanguage("de");
                break;
            case "pt":
                Dictionary.setLanguage("pt");
                break;
            default:
                console.error(`Language ${new_lang} not known.`);
                break;
        }
        updateView();
    }

    /**
     * Extracts the current path out of the window location, removes the slash
     * in the front and removes the filetype. A '/' will be mapped to 'index'.
     *
     * @returns {string} Current page name
     */
    function getCurrentPath() {
        let currentPath = window.location.pathname;
        if (currentPath.charAt(0) === "/") {
            currentPath = currentPath.slice(1);
        }
        if (currentPath.includes(".html")) {
            currentPath = currentPath.slice(0, currentPath.indexOf(".html"));
        }
        if (!currentPath) {
            currentPath = "index";
        }
        return currentPath;
    }

    /**
     * Updates the current view by replacing all text strings. Per default it
     * uses the html element property `text` to replace the text. However, not
     * all HTML elements has a `text` property. If the data attribute includes
     * the suffix `[value]`, the `value` property will be used instead.
     */
    function updateView() {
        const currentPath = getCurrentPath();
        $("[data-lang]").each(function (index, element) {
            let langKey = $(element).data("lang").trim();
            if (langKey.startsWith("[value]")) {
                langKey = langKey.slice(7, langKey.length);
                $(element).val(Dictionary.getString(langKey, currentPath));
            } else {
                $(element).text(Dictionary.getString(langKey, currentPath));
            }
        });
    }

    $(document).ready(function () {
        updateView();
    });

    exports.changeLang = changeLang;
})(jQuery, window);
