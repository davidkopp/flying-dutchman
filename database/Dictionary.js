/*
 * File: Dictionary.js
 *
 * This file includes some global constants and the dictionary for the localization of the application.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Saturday, 12th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */

const Constants = {
    LANGUAGE_CODE_ENGLISH: "en",
    LANGUAGE_CODE_GERMAN: "de",
    LANGUAGE_CODE_PORTUGUESE: "pt",

    DEFAULT_LANGUAGE: "en",

    PAGE_HOME: "index",
    PAGE_LOGIN: "login",
    PAGE_MENU: "menu",

    BEER_filter: "beer",
    WINE_filter: "wine",
    DRINK_filter: "drink",
    WATER_filter: "water",

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
    STORAGE_LOGGED_IN_USER_KEY: "logged_in_user",
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

    ACCESS_LEVEL_MANAGER: 0,
    ACCESS_LEVEL_BARTENDER: 1,
    ACCESS_LEVEL_WAITER: 2,
    ACCESS_LEVEL_VIP: 3,
    ACCESS_LEVEL_NONE: 4,

    DATA_LANG_DYNAMIC_KEY: "data-lang-dynamic-key",
    DATA_LANG_DYNAMIC_VALUE: "data-lang-dynamic-value",
};

const Dictionary = {
    // ENGLISH
    en: {
        // Common text strings (relevant for multiple pages)
        _: {
            "logged-in-user-label": "Logged in user:",
            "logout-button-title": "Logout",
            "language-flag-title-english": "English",
            "language-flag-title-german": "German",
            "language-flag-title-portuguese": "Portuguese",
            "logo-title": "To home page",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "Flying Dutchman - Welcome",
            "header-page-title": "Welcome!",
            "link-to-login-page": "Login",
            "go-to-menu-button-title": "Go to menu",
        },
        // Text strings for the page 'menu'
        menu: {
            "page-title": "Flying Dutchman - Menu",
            "header-page-title": "Menu",
            "caption": "Menu",
            "filter-icon-title-beer": "Beer",
            "filter-icon-title-wine": "Wine",
            "filter-icon-title-drink": "Drink",
            "filter-icon-title-water": "Water",
        },
        // Text strings for the page 'login'
        login: {
            "page-title": "Flying Dutchman - Login",
            "caption": "Login",
            "username-label": "Username",
            "password-label": "Password",
            "login-form-submit": "Login",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "page-title": "Flying Dutchman - Staff Dashboard",
            "header-page-title": "Staff Dashboard",
            "orders-overview-title": "Orders",
            "orders-overview-table-label": "Table",
            "order-details-id-label": "Order number:",
            "order-details-inventory-label": "Inventory:",
            "create-order-button-text": "Create new order",
            "inventory-overview-title": "Inventory",
            "restock-button-text": "Restock",
            "orders-list-total-number-label": "Number of orders:",
            "inventory-notifications-total-number-label": "Items running out:",
            "order-details-heading-with-table-number": "Orders for table",
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
            "details-overlay-delete-order-button": "Delete Order",
            "details-overlay-edit-order-button": "Edit Order",
            "add-more-items-button": "Add more items",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "order-list-order-number": "Order",
            "order-list-status": "Status",
            "order-list-items": "Items",
            "order-list-notes": "Notes",
            "order-list-actions": "Actions",
            "order-list-status-dynamic": {
                true: "done",
                false: "tbd.",
            },
            "order-details-notes-label": "Notes:",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "page-title": "Flying Dutchman - VIP Dashboard",
            "header-page-title": "VIP Dashboard",
            "table-number-heading": "Table Number",
            "vip-welcome-text": "Welcome",
            "vip-account-balance-text": "Balance =",
            "place-order-button": "Place Order",
            "menu-heading": "Menu",
            "specials-heading": "Specials",
            "waiter-call-button": "Waiter Call",
            "pay-bill-button": "Pay Bill",
            "info-box-title": "Info",
        },
        // Text strings for the page 'manager dashboard'
        manager_dashboard: {
            "page-title": "Flying Dutchman - Manager Dashboard",
            "header-page-title": "Manager Dashboard",
            "inventory-name-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "beverage-status-dynamic": {
                true: "Active",
                false: "Removed",
            },
            "beverage-status-button-dynamic": {
                true: "Hide",
                false: "Show",
            },
        },
        // Text strings for the SpecRunner (unit tests)
        SpecRunner: {
            "unit-test": "english",
        },
    },
    // GERMAN
    de: {
        // Common text strings (relevant for multiple pages)
        _: {
            "logged-in-user-label": "Angemeldet als:",
            "logout-button-title": "Ausloggen",
            "language-flag-title-english": "Englisch",
            "language-flag-title-german": "Deutsch",
            "language-flag-title-portuguese": "Portugiesisch",
            "logo-title": "Zur Startseite",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "Flying Dutchman - Willkommen",
            "header-page-title": "Willkommen!",
            "link-to-login-page": "Anmelden",
            "go-to-menu-button-title": "Gehe zum Menü",
        },
        // Text strings for the page 'menu'
        menu: {
            "page-title": "Flying Dutchman - Menü",
            "header-page-title": "Menü",
            "caption": "Menü",
            "filter-icon-title-beer": "Bier",
            "filter-icon-title-wine": "Wein",
            "filter-icon-title-drink": "Drink",
            "filter-icon-title-water": "Wasser",
        },
        // Text strings for the page 'login'
        login: {
            "page-title": "Flying Dutchman - Anmeldung",
            "caption": "Anmeldung",
            "username-label": "Benutzername",
            "password-label": "Passwort",
            "login-form-submit": "Anmelden",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "page-title": "Flying Dutchman - Intern",
            "header-page-title": "Dashboard für Angestellte",
            "orders-overview-title": "Bestellungen",
            "orders-overview-table-label": "Tisch",
            "order-details-id-label": "Bestellungnummer:",
            "order-details-inventory-label": "Lager:",
            "create-order-button-text": "Neue Bestellung",
            "inventory-overview-title": "Lager",
            "restock-button-text": "Auffüllen",
            "orders-list-total-number-label": "Anzahl an Bestellungen:",
            "inventory-notifications-total-number-label": "Geringe Anzahl:",
            "order-details-heading-with-table-number": "Bestellungen für Tisch",
            "create-order-items-label": "Erstelle eine neue Bestellung:",
            "order-details-items-label": "Artikel:",
            "inventory-details-label": "Lager:",
            "inventory-details-items-running-low-label":
                "Artikel mit geringem Bestand:",
            "create-order-title": "Erstelle eine neue Bestellung",
            "create-order-table-label": "Tisch:",
            "create-order-add-item-label": "Artikel:",
            "create-order-notes-label": "Notiz:",
            "create-order-inventory-label": "Lager:",
            "create-order-inventory-label-bar": "Bar",
            "create-order-inventory-label-vip": "VIP",
            "create-order-form-submit": "Neue Bestellung",
            "details-overlay-delete-order-button": "Bestellung löschen",
            "details-overlay-edit-order-button": "Bestellung bearbeiten",
            "add-more-items-button": "Mehr Artikel",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Kühlschrank",
            },
            "order-list-order-number": "Bestellung",
            "order-list-status": "Status",
            "order-list-items": "Artikel",
            "order-list-notes": "Notizen",
            "order-list-actions": "Aktionen",
            "order-list-status-dynamic": {
                true: "erledigt",
                false: "tbd.",
            },
            "order-details-notes-label": "Notizen:",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "page-title": "Flying Dutchman - VIP Dashboard",
            "header-page-title": "VIP Dashboard",
            "table-number-heading": "Tischnummer",
            "vip-welcome-text": "Willkommen",
            "vip-account-balance-text": "Kontostand =",
            "place-order-button": "Bestellen",
            "menu-heading": "Menü",
            "specials-heading": "VIP Spezialitäten",
            "waiter-call-button": "Rufe Kellner*in",
            "pay-bill-button": "Bezahlen",
            "info-box-title": "Info",
        },
        // Text strings for the page 'manager dashboard'
        manager_dashboard: {
            "page-title": "Flying Dutchman - Manager Dashboard",
            "header-page-title": "Manager Dashboard",
            "inventory-name-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Kühlschrank",
            },
            "beverage-status-dynamic": {
                true: "Aktiv",
                false: "Entfernt",
            },
            "beverage-status-button-dynamic": {
                true: "Entfernen",
                false: "Anzeigen",
            },
        },
        // Text strings for the SpecRunner (unit tests)
        SpecRunner: {
            "unit-test": "german",
        },
    },
    // Portuguese
    pt: {
        // TODO: Translate the english text strings into portuguese
        // Common text strings (relevant for multiple pages)
        _: {
            "logged-in-user-label": "Logged in usuario:",
            "logout-button-title": "Logout",
            "language-flag-title-english": "English",
            "language-flag-title-german": "German",
            "language-flag-title-portuguese": "Portuguese",
            "logo-title": "To home page",
        },
        // Text strings for the page 'index'
        index: {
            "page-title": "Flying Dutchman - Welcome",
            "header-page-title": "Welcome!",
            "link-to-login-page": "Login",
            "go-to-menu-button-title": "Go to menu",
        },
        // Text strings for the page 'menu'
        menu: {
            "page-title": "Flying Dutchman - Menu",
            "header-page-title": "Menu",
            "caption": "Menu",
            "filter-icon-title-beer": "Beer",
            "filter-icon-title-wine": "Wine",
            "filter-icon-title-drink": "Drink",
            "filter-icon-title-water": "Water",
        },
        // Text strings for the page 'login'
        login: {
            "page-title": "Flying Dutchman - Login",
            "caption": "Login",
            "username-label": "Username",
            "password-label": "Password",
            "login-form-submit": "Login",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "page-title": "Flying Dutchman - Staff Dashboard",
            "header-page-title": "Staff Dashboard",
            "orders-overview-title": "Orders",
            "orders-overview-table-label": "Table",
            "order-details-id-label": "Order number:",
            "order-details-inventory-label": "Inventory:",
            "create-order-button-text": "Create new order",
            "inventory-overview-title": "Inventory",
            "restock-button-text": "Restock",
            "orders-list-total-number-label": "Number of orders:",
            "inventory-notifications-total-number-label": "Items running out:",
            "order-details-heading-with-table-number": "Orders for table",
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
            "details-overlay-delete-order-button": "Delete Order",
            "details-overlay-edit-order-button": "Edit Order",
            "add-more-items-button": "Add more items",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "order-list-order-number": "Order",
            "order-list-status": "Status",
            "order-list-items": "Items",
            "order-list-notes": "Notes",
            "order-list-actions": "Actions",
            "order-list-status-dynamic": {
                true: "done",
                false: "tbd.",
            },
            "order-details-notes-label": "Notes:",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "page-title": "Flying Dutchman - VIP Dashboard",
            "header-page-title": "VIP Dashboard",
            "table-number-heading": "Table Number",
            "vip-welcome-text": "Welcome",
            "vip-account-balance-text": "Balance =",
            "place-order-button": "Place Order",
            "menu-heading": "Menu",
            "specials-heading": "Specials",
            "waiter-call-button": "Waiter Call",
            "pay-bill-button": "Pay Bill",
            "info-box-title": "Info",
        },
        // Text strings for the page 'manager dashboard'
        manager_dashboard: {
            "page-title": "Flying Dutchman - Manager Dashboard",
            "header-page-title": "Manager Dashboard",
            "inventory-name-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "beverage-status-dynamic": {
                true: "Active",
                false: "Removed",
            },
            "beverage-status-button-dynamic": {
                true: "Hide",
                false: "Show",
            },
        },
        SpecRunner: {
            "unit-test": "english",
        },
    },
};
