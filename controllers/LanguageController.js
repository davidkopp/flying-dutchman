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
     * Extracts the current page name out of the window location, removes the
     * slash in the front and removes the filetype.
     *
     * @returns {string} Current page name
     */
    function getCurrentPageName() {
        let currentPageName = window.location.pathname;
        if (currentPageName.charAt(0) === "/") {
            currentPageName = currentPageName.slice(1);
        }
        if (currentPageName.includes(".html")) {
            currentPageName = currentPageName.slice(
                0,
                currentPageName.indexOf(".html")
            );
        }
        return currentPageName;
    }

    /** Updates the current view by replacing all text strings. */
    function updateView() {
        updateCommonTextStrings();
        const currentPageName = getCurrentPageName();
        switch (currentPageName) {
            case "index":
                updateViewIndex();
                break;
            case "login":
                updateViewLogin();
                break;
            case "menu":
                updateViewMenu();
                break;
            default:
                console.log(
                    `LanguageController.updateView | Page '${currentPageName}' unknown!`
                );
                break;
        }
    }

    /** Updates text strings that are common through multiple pages. */
    function updateCommonTextStrings() {
        $("#language-switcher-text-english").text(
            Dictionary.getCommonString("language-switcher-text-english")
        );
        $("#language-switcher-text-german").text(
            Dictionary.getCommonString("language-switcher-text-german")
        );
        $("#language-switcher-text-portugese").text(
            Dictionary.getCommonString("language-switcher-text-portugese")
        );
    }

    /** Updates the view 'index' by replacing all text strings. */
    function updateViewIndex() {
        const page = "index";
        $("#page-title").text(Dictionary.getPageString(page, "page-title"));
        $("#caption").text(Dictionary.getPageString(page, "caption"));
        $("#welcome-text").text(Dictionary.getPageString(page, "hello_text"));
        $("#link-to-login-page").text(
            Dictionary.getPageString(page, "link-to-login-page")
        );
        $("#link-to-menu-page").text(
            Dictionary.getPageString(page, "link-to-menu-page")
        );
    }

    /** Updates the view 'login' by replacing all text strings. */
    function updateViewLogin() {
        const page = "login";
        $("#page-title").text(Dictionary.getPageString(page, "page-title"));
        $("#caption").text(Dictionary.getPageString(page, "caption"));
        $("#username-label").text(Dictionary.getPageString(page, "username"));
        $("#password-label").text(Dictionary.getPageString(page, "password"));
        $("#login-form-submit").val(
            Dictionary.getPageString(page, "login-form-submit")
        );
    }

    /** Updates the view 'menu' by replacing all text strings. */
    function updateViewMenu() {
        const page = "menu";

        $("#page-title").text(Dictionary.getPageString(page, "page-title"));
        $("#caption").text(Dictionary.getPageString(page, "caption"));
        $("#order").text(Dictionary.getPageString(page, "order"));
        $("#pay").text(Dictionary.getPageString(page, "pay"));
    }

    $(document).ready(function () {
        updateView();
    });

    exports.changeLang = changeLang;
})(jQuery, window);
