/*
 * File: Dictionary.js
 *
 * This file includes some global constants and the dictionary for the localization of the application.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Thursday, 3rd March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */

const Constants = {
    DEFAULT_LANGUAGE: "en",

    PAGE_HOME: "index",
    PAGE_LOGIN: "login",
    PAGE_MENU: "menu",

    BEER_CATEGORY: ["ÖL", "CIDER"],
    WINE_CATEGORY: ["MOUSSERANDE", "VIN"],
    DRINKS_CATEGORY: [
        "APERITIF",
        "BLANDDRYCKER",
        "LIKÖR",
        "COCKTAIL",
        "WHISKY",
        "SAKE",
        "SPRIT",
        "ROM",
    ],
    WATER_CATEGORY: ["VATTEN"],

    INVENTORIES: {
        BAR: "barInventory",
        VIP: "vipInventory",
    },

    LOW_STOCK_NUMBER: 5,

    SESSION_STORAGE_LANGUAGE_KEY: "language",
};

const Dictionary = {
    // ENGLISH
    en: {
        // Common text strings (relevant for multiple pages)
        _: {
            "language-switcher-text-english": "English",
            "language-switcher-text-german": "German",
            "language-switcher-text-portuguese": "Portuguese",
            "link-to-login-page": "Login",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "Flying Dutchman - English",
            "caption": "Welcome to Flying Dutchman",
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
        SpecRunner: {
            "unit-test": "english",
        },
    },
    // GERMAN
    de: {
        // Common text strings (relevant for multiple pages)
        _: {
            "language-switcher-text-english": "Englisch",
            "language-switcher-text-german": "Deutsch",
            "language-switcher-text-portuguese": "Portugiesisch",
            "link-to-login-page": "Anmelden",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "Flying Dutchman - Englisch",
            "caption": "Willkommen zum Flying Dutchman",
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
        SpecRunner: {
            "unit-test": "german",
        },
    },
    // Portuguese
    pt: {
        // Common text strings (relevant for multiple pages)
        _: {
            "language-switcher-text-english": "Englisch",
            "language-switcher-text-german": "Deutsch",
            "language-switcher-text-portuguese": "Portugiesisch",
            "link-to-login-page": "",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "",
            "caption": "Bemvindo ao Flying Dutchman",
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
        SpecRunner: {
            "unit-test": "portuguese",
        },
    },
};
