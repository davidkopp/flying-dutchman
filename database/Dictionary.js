/*
 * File: Dictionary.js
 *
 * This file includes some global constants and the dictionary for the localization of the application.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 5th March 2022
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

    STORAGE_LANGUAGE_KEY: "language",
    STORAGE_DB_USERS_KEY: "db_users",
    STORAGE_DB_ACCOUNT_KEY: "db_account",
    STORAGE_DB_ORDERS_KEY: "db_orders",
    STORAGE_DB_BILLS_KEY: "db_bills",
    STORAGE_DB_TANNINS_KEY: "db_tannins",
    STORAGE_DB_ALLERGIES_KEY: "db_allergies",
    STORAGE_DB_INVENTORY_BAR_KEY: "db_inventory_bar",
    STORAGE_DB_INVENTORY_VIP_KEY: "db_inventory_vip",
    STORAGE_DB_HIDE_FROM_MENU_KEY: "db_hideFromMenu",
    STORAGE_DB_BEVERAGES_KEY: "db_beverages",
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
        staff_dashboard: {
            "page-title": "Flying Dutchman - Staff Dashboard",
            "orders-overview-title": "Orders",
            "create-order-button-text": "Create",
            "inventory-overview-title": "Inventory",
            "restock-button-text": "Restock",
            "orders-list-total-number-label": "total:",
            "inventory-notifications-total-number-label": "total:",
            "order-details-table-label": "Table:",
            "create-order-items-label": "Items:",
            "order-details-items-label": "Items:",
            "inventory-details-label": "Inventory:",
            "inventory-details-items-running-low-label": "Items running low:",
            "create-order-title": "Create a new order",
            "create-order-table-label": "Table:",
            "create-order-add-item-label": "Item:",
            "create-order-notes-label": "Notes:",
            "create-order-inventory-label": "Inventory:",
            "create-order-inventory-label-bar": "Bar",
            "create-order-inventory-label-vip": "VIP",
            "create-order-form-submit": "Create Order",
            "delete-order-button": "Delete Order",
            "add-item-button": "Add more items",
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
        staff_dashboard: {
            "page-title": "Flying Dutchman - Mitarbeitenden Dashboard",
            "orders-overview-title": "Bestellungen",
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
        staff_dashboard: {
            "page-title": "",
        },
        SpecRunner: {
            "unit-test": "portuguese",
        },
    },
};
