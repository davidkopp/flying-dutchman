Dictionary = (function () {
    let language = "en";

    const dict = {
        en: {
            hello_text: "Welcome to Flying Dutchman",
            username: "Username",
            password: "Password",
            order: "Order",
            pay: "Pay",
            login: "Login",
        },
        de: {
            hello_text: "Willkommen zum Flying Dutchman",
            username: "Benutzername",
            password: "Passwort",
            order: "Bestellung",
            pay: "Zahlung",
            login: "Anmelden",
        },
        pt: {
            hello_text: "Bemvindo ao Flying Dutchman",
            username: "",
            password: "",
            order: "",
            pay: "",
            login: "",
        },
    };

    /**
     * Get the appropriate string for a given key.
     *
     * @param {string} key The key.
     * @returns {string} The text string.
     */
    function getString(key) {
        return dict[language][key];
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
