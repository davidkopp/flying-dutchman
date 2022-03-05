/*
 * File: LanguageController.js
 *
 * Controller that is responsible for changing the language and updating the view accordingly.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 5th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /** Initialize the language and update the view when the DOM is ready. */
    $(document).ready(function () {
        init();
        updateView();
    });

    /**
     * Changes the language for the whole system and updates the view automatically.
     *
     * @param {string} new_lang The new language in country codes
     */
    function changeLang(new_lang) {
        switch (new_lang) {
            case "en":
                setLanguage("en");
                break;
            case "de":
                setLanguage("de");
                break;
            case "pt":
                setLanguage("pt");
                break;
            default:
                console.error(`Language ${new_lang} not known.`);
                break;
        }
        updateView();
    }

    /**
     * Extracts the current path out of the window location, removes the slash
     * in the front and removes the filetype. A '/' will be mapped to the
     * default home page path.
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
            currentPath = Constants.PAGE_HOME;
        }
        return currentPath;
    }

    /** Initializes the language. If their is no language set, use the default language. */
    function init() {
        if (!getCurrentLanguage()) {
            console.log(
                `LanguageController.init | There is no language definied yet. Use the default language '${Constants.DEFAULT_LANGUAGE}'.`
            );
            setLanguage(Constants.DEFAULT_LANGUAGE);
        }
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
                $(element).val(getString(langKey, currentPath));
            } else {
                $(element).text(getString(langKey, currentPath));
            }
        });
    }

    /**
     * Get the current language from the sessionStorage.
     *
     * @returns {string} The current language as country code.
     */
    function getCurrentLanguage() {
        return sessionStorage.getItem(Constants.STORAGE_LANGUAGE_KEY);
    }

    /**
     * Save the new language in the sessionStorage
     *
     * @param {string} newLang The new language as country code.
     */
    function setLanguage(newLang) {
        sessionStorage.setItem(Constants.STORAGE_LANGUAGE_KEY, newLang);
    }

    /**
     * Get the appropriate string for a key and an optional page. If no page is
     * given the key is supposed to be a key for a common string.
     *
     * @param {string} key The key.
     * @param {string} [page] The page. If not set the key is supposed to be a
     *   key for a common string.
     * @returns {string} The text string.
     */
    function getString(key, page) {
        let result = undefined;
        const currentLanguage = getCurrentLanguage();
        if (page) {
            // Get the value for the key and the provided page.
            let pageDict = Dictionary[currentLanguage][page];
            if (pageDict) {
                result = pageDict[key];
                if (!result) {
                    // The key does not exist for the given page.
                    // Check if the key is known as a common key.
                    result = Dictionary[currentLanguage]["_"][key];
                    if (!result) {
                        console.log(
                            `LanguageController.getString | Language key '${key}' is not set for language '${currentLanguage}' and page '${page}'.`
                        );
                    }
                }
            } else {
                console.log(
                    `LanguageController.getString | Page '${page}' is unknown in the Dictionary.`
                );
            }
        }

        if (!result) {
            // Try to get the value for the common key.
            result = Dictionary[currentLanguage]["_"][key];
            if (!result) {
                console.log(
                    `LanguageController.getString | Common language key '${key}' is not set for language '${currentLanguage}'.`
                );
            }
        }
        return result;
    }

    exports.changeLang = changeLang;
})(jQuery, window);
