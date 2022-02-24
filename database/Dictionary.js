Dictionary = (function () {
    let language = "en";

    const dict = {
        en: {
            // Common text strings
            _: {
                "language-switcher-text-english": "English",
                "language-switcher-text-german": "German",
                "language-switcher-text-portugese": "Portugese",
            },
            // Text strings for the page 'index'
            index: {
                "page-title": "Flying Dutchman - English",
                "caption": "Welcome to Flying Dutchman",
                "link-to-login-page": "Login",
                "link-to-menu-page": "Menu",
            },
            // Text strings for the page 'menu'
            menu: {
                "page-title": "Flying Dutchman - Menu",
                "caption": "Menu",
                "order": "Order",
                "pay": "Pay",
            },
            // Text strings for the page 'login'
            login: {
                "page-title": "Flying Dutchman - Login",
                "caption": "Login",
                "username": "Username",
                "password": "Password",
                "login-form-submit": "Login",
            },
        },
        de: {
            // Common text strings
            _: {
                "language-switcher-text-english": "Englisch",
                "language-switcher-text-german": "Deutsch",
                "language-switcher-text-portugese": "Portugiesisch",
            },
            // Text strings for the page 'index'
            index: {
                "page-title": "Flying Dutchman - Englisch",
                "caption": "Willkommen zum Flying Dutchman",
                "link-to-login-page": "Anmelden",
                "link-to-menu-page": "Menü",
            },
            // Text strings for the page 'menu'
            menu: {
                "page-title": "Flying Dutchman - Menü",
                "caption": "Menü",
                "order": "Bestellung",
                "pay": "Zahlung",
            },
            // Text strings for the page 'login'
            login: {
                "page-title": "Flying Dutchman - Anmeldung",
                "caption": "Anmeldung",
                "username": "Benutzername",
                "password": "Passwort",
                "login-form-submit": "Anmelden",
            },
        },
        pt: {
            // Common text strings
            _: {
                "language-switcher-text-english": "Englisch",
                "language-switcher-text-german": "Deutsch",
                "language-switcher-text-portugese": "Portugiesisch",
            },
            // Text strings for the page 'index'
            index: {
                "page-title": "",
                "caption": "Bemvindo ao Flying Dutchman",
                "link-to-login-page": "",
                "link-to-menu-page": "",
            },
            // Text strings for the page 'menu'
            menu: {
                "page-title": "",
                "caption": "",
                "order": "",
                "pay": "",
            },
            // Text strings for the page 'login'
            login: {
                "page-title": "",
                "caption": "",
                "username": "",
                "password": "",
                "login-form-submit": "",
            },
        },
    };

    /**
     * Get the appropriate common string for a given key.
     *
     * @param {string} key The key.
     * @returns {string} The text string.
     */
    function getCommonString(key) {
        return dict[language]["_"][key];
    }

    /**
     * Get the appropriate string for a given page and key.
     *
     * @param {string} page The page.
     * @param {string} key The key.
     * @returns {string} The text string.
     */
    function getPageString(page, key) {
        return dict[language][page][key];
    }

    /**
     * Get the current language.
     *
     * @returns {string} The current language as country code.
     */
    function getCurrentLanguage() {
        return language;
    }

    /**
     * Set a new language.
     *
     * @param {string} newLang The new language as country code.
     */
    function setLanguage(newLang) {
        language = newLang;
    }

    return {
        getCommonString: getCommonString,
        getPageString: getPageString,
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
    };
})();
