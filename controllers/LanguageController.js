/*
 * File: LanguageController.js
 *
 * Controller that is responsible for changing the language and updating the view accordingly.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Wednesday, 23rd February 2022
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

    /** Updates the view by replacing all text strings. */
    function updateView() {
        $("#welcome-text").text(Dictionary.getString("hello_text"));
        $("#username-label").text(Dictionary.getString("username"));
        $("#password-label").text(Dictionary.getString("password"));
        $("#order").text(Dictionary.getString("order"));
        $("#pay").text(Dictionary.getString("pay"));
        $("#login-form-submit").val(Dictionary.getString("login"));
    }

    $(document).ready(function () {
        updateView();
    });

    exports.changeLang = changeLang;
})(jQuery, window);
