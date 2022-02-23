Dictionary = (function () {
    var language = "en";

    // ==========================================================================
    // The dictionary consists of a simple JSON structure. It also keeps
    // track of the different keys that are available for IDs.
    //
    var dict = {
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

    // This function will return the appropriate string for each key.
    function getString(key) {
        return dict[language][key];
    }

    function getCurrentLanguage() {
        return language;
    }

    function setLanguage(newLang) {
        language = newLang;
    }

    return {
        getString: getString,
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
    };
})();
