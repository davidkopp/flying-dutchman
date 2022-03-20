/*
 * File: LanguageController.js
 *
 * Controller that is responsible for changing the language and updating the view accordingly.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 19th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    /** Initialize the language and update the view when the DOM is ready. */
    $(document).ready(function () {
        init();
        refreshTextStrings();
    });

    /**
     * Changes the language for the whole system and updates the view automatically.
     *
     * @param {string} new_lang The new language in country codes
     */
    function changeLang(new_lang) {
        switch (new_lang) {
            case Constants.LANGUAGE_CODE_ENGLISH:
                setLanguage(Constants.LANGUAGE_CODE_ENGLISH);
                break;
            case Constants.LANGUAGE_CODE_GERMAN:
                setLanguage(Constants.LANGUAGE_CODE_GERMAN);
                break;
            case Constants.LANGUAGE_CODE_PORTUGUESE:
                setLanguage(Constants.LANGUAGE_CODE_PORTUGUESE);
                break;
            default:
                console.error(`Language ${new_lang} not known.`);
                break;
        }
        refreshTextStrings();
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

    /**
     * Initializes the language and the language flags. If their is no language
     * set, use the default language.
     */
    function init() {
        if (!getCurrentLanguage()) {
            console.log(
                `LanguageController.init | There is no language definied yet. Use the default language '${Constants.DEFAULT_LANGUAGE}'.`
            );
            setLanguage(Constants.DEFAULT_LANGUAGE);
        }

        // Add event handler to the language flags
        $(".lang-flag").click(function () {
            const countryCode = $(this).data("country-code");
            changeLang(countryCode);

            $(".lang-flag").removeClass("active-language");
            $(this).addClass("active-language");
        });

        // Get flag element for current language and change it's appearance.
        const countryCode = getCurrentLanguage();
        const $flag = $("div[data-country-code='" + countryCode + "']");
        if ($flag) {
            $flag.addClass("active-language");
        } else {
            `LanguageController.init | There is no language flag known for the country code '${countryCode}'!.`;
        }
    }

    /** Initializes or refreshes all text strings (static and dynamic) on the current page. */
    function refreshTextStrings() {
        refreshStaticTextStrings();
        refreshDynamicTextStrings();
    }

    /**
     * Updates the current view by replacing all static text strings. Per
     * default it uses the html element property `text` to replace the text.
     * However, not all HTML elements have a `text` property. If the data
     * attribute includes the suffix `[value]`, the `value` property will be
     * used instead.
     */
    function refreshStaticTextStrings() {
        const currentPath = getCurrentPath();

        // Update the text strings with static contents
        $("[data-lang]").each(function (index, element) {
            let langKey = $(element).data("lang").trim();
            if (langKey.startsWith("[value]")) {
                langKey = langKey.slice(7, langKey.length);
                $(element).val(getValueFromDictionary(langKey, currentPath));
            } else if (langKey.startsWith("[title]")) {
                langKey = langKey.slice(7, langKey.length);
                $(element).prop(
                    "title",
                    getValueFromDictionary(langKey, currentPath)
                );
            } else {
                $(element).text(getValueFromDictionary(langKey, currentPath));
            }
        });
    }

    /** Updates the current view by replacing all dynamic text strings. */
    function refreshDynamicTextStrings() {
        const currentPath = getCurrentPath();

        // Update the text strings with dynamic contents
        // Depending on the current value, the text will be replaced accordingly.
        const elements = $(`[${Constants.DATA_LANG_DYNAMIC_KEY}]`);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            let typeOfInsertion = "text";
            let langDynamicKey = $(element).attr(
                Constants.DATA_LANG_DYNAMIC_KEY
            );
            const langDynamicValue = $(element).attr(
                Constants.DATA_LANG_DYNAMIC_VALUE
            );
            if (!langDynamicValue) {
                console.log(
                    `LanguageController | Dynamic content can't be replaced for the key '${langDynamicKey}'. There is no value given.`
                );
                continue;
            }
            if (langDynamicKey.startsWith("[title]")) {
                langDynamicKey = langDynamicKey.slice(7, langDynamicKey.length);
                typeOfInsertion = "title";
            }
            const langObjectFromDict = getValueFromDictionary(
                langDynamicKey,
                currentPath
            );

            if (
                typeof langObjectFromDict !== "object" ||
                langObjectFromDict === null
            ) {
                console.log(
                    `LanguageController | Dynamic content '${langDynamicValue}' can't be replaced. There are no values for the key '${langDynamicKey}' defined in the dictionary.`
                );
                continue;
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    langObjectFromDict,
                    langDynamicValue
                )
            ) {
                const value = langObjectFromDict[langDynamicValue];
                switch (typeOfInsertion) {
                    case "text":
                        $(element).text(value);

                        break;
                    case "title":
                        $(element).prop("title", value);
                        break;
                    default:
                        console.log(
                            `LanguageController | Type of insertion '${typeOfInsertion}' unknown!`
                        );
                        break;
                }
            } else {
                console.log(
                    `LanguageController | Dynamic content '${langDynamicValue}' is not known for the key '${langDynamicValue}'.`
                );
            }
        }
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
    function getValueFromDictionary(key, page) {
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
                    if (!result && page != "SpecRunner") {
                        console.log(
                            `LanguageController.getValueFromDictionary | Language key '${key}' is not set for language '${currentLanguage}' and page '${page}'.`
                        );
                    }
                }
            } else {
                console.log(
                    `LanguageController.getValueFromDictionary | Page '${page}' is unknown in the Dictionary.`
                );
            }
        }

        if (!result && page != "SpecRunner") {
            // Try to get the value for the common key.
            result = Dictionary[currentLanguage]["_"][key];
            if (!result) {
                console.log(
                    `LanguageController.getValueFromDictionary | Common language key '${key}' is not set for language '${currentLanguage}'.`
                );
            }
        }
        return result;
    }

    exports.LanguageController = {};
    exports.LanguageController.changeLang = changeLang;
    exports.LanguageController.refreshTextStrings = refreshTextStrings;
    exports.LanguageController.refreshStaticTextStrings =
        refreshStaticTextStrings;
    exports.LanguageController.refreshDynamicTextStrings =
        refreshDynamicTextStrings;
})(jQuery, window);
