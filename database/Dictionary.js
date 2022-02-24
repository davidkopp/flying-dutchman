Dictionary = (function () {
    let language = "en";

    const dict = {
        // ENGLISH
        en: {
            // Common text strings
            _: {
                "language-switcher-text-english": "English",
                "language-switcher-text-german": "German",
                "language-switcher-text-portuguese": "Portuguese",
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
                "username-label": "Username",
                "password-label": "Password",
                "login-form-submit": "Login",
            },
        },
        // GERMAN
        de: {
            // Common text strings
            _: {
                "language-switcher-text-english": "Englisch",
                "language-switcher-text-german": "Deutsch",
                "language-switcher-text-portuguese": "Portugiesisch",
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
                "username-label": "Benutzername",
                "password-label": "Passwort",
                "login-form-submit": "Anmelden",
            },
        },
        // Portuguese
        pt: {
            // Common text strings
            _: {
                "language-switcher-text-english": "Englisch",
                "language-switcher-text-german": "Deutsch",
                "language-switcher-text-portuguese": "Portugiesisch",
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
                "username-label": "",
                "password-label": "",
                "login-form-submit": "",
            },
        },
    };

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
        if (page) {
            // Get the value for the key and the provided page.
            result = dict[language][page][key];
            if (!result) {
                // The key does not exist for the given page.
                // Check if the key is known as a common key.
                result = dict[language]["_"][key];
                if (!result) {
                    console.log(
                        `Dictionary.getString | Language key '${key}' is not set for language '${language}' and page '${page}'.`
                    );
                }
            }
        } else {
            // Get the value for the common key.
            result = dict[language]["_"][key];
            if (!result) {
                console.log(
                    `Dictionary.getString | Common language key '${key}' is not set for language '${language}'.`
                );
            }
        }
        return result;
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
        getString: getString,
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
    };
})();
