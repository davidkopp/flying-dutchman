/*
 * File: Dictionary.js
 *
 * This file includes some global constants and the dictionary for the localization of the application.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 20th March 2022
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
    STORAGE_DB_BEVERAGES_KEY: "db_beverages",

    ACCESS_LEVEL_MANAGER: 0,
    ACCESS_LEVEL_BARTENDER: 1,
    ACCESS_LEVEL_WAITER: 2,
    ACCESS_LEVEL_VIP: 3,
    ACCESS_LEVEL_NONE: 4,

    DATA_LANG_DYNAMIC_KEY: "data-lang-dynamic-key",
    DATA_LANG_DYNAMIC_VALUE: "data-lang-dynamic-value",

    CURRENCY_IN_VIEW: "SEK",
};

const Dictionary = {
    // ENGLISH
    en: {
        // Common text strings (relevant for multiple pages)
        _: {
            "lang-flag-title-english": "English",
            "lang-flag-title-german": "German",
            "lang-flag-title-portuguese": "Portuguese",
            "logged-in-user-label": "Logged in user:",
            "logout-button-title": "Logout",
            "logo-title": "To home page",
            "home-button-title": "To home page",
        },
        // Text strings for the page 'index'
        index: {
            "head-page-title": "Flying Dutchman - Welcome",
            "page-title": "Welcome!",
            "link-to-login-page": "Login",
            "go-to-menu-button-title": "Go to menu",
        },
        // Text strings for the page 'menu'
        menu: {
            "head-page-title": "Flying Dutchman - Menu",
            "page-title": "Menu",
            "caption": "Menu",
            "filter-icon-title-beer": "Beer",
            "filter-icon-title-wine": "Wine",
            "filter-icon-title-drink": "Drink",
            "filter-icon-title-water": "Water",
            "button-label-allergies": "Allergies",
            "button-label-price": "Price",
            "button-label-tannin": "Tannin",
            "button-label-alcohol": "Alcohol %",
            "menu-item-label-origin": "Origin:",
            "menu-item-label-producer": "Producer:",
            "menu-item-label-alcoholstrength": "Alcohol:",
            "menu-item-label-packaging": "Packaging:",
            "menu-item-label-price": "Price:",
            "menu-item-label-year": "Year:",
        },
        // Text strings for the page 'login'
        login: {
            "head-page-title": "Flying Dutchman - Login",
            "caption": "Login",
            "username-label": "Username",
            "password-label": "Password",
            "login-form-submit": "Login",
            "message-wrong-credentials": "Wrong user name or password!",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "head-page-title": "Flying Dutchman - Staff Dashboard",
            "page-title": "Staff Dashboard",
            "orders-overview-title": "Orders",
            "orders-overview-table-label": "Table",
            "order-details-id-label": "Order number:",
            "order-details-inventory-label": "Inventory:",
            "create-order-button-text": "Create new order",
            "inventory-bar-overview-title": "Inventory Bar",
            "inventory-vip-overview-title": "Inventory Specials",
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
            "delete-order-button": "Delete Order",
            "edit-order-button": "Edit Order",
            "order-paid-button": "Order paid",
            "add-more-items-button": "Add more items",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "order-list-order-number": "Order",
            "order-list-status": "Status",
            "order-list-items": "Items",
            "order-list-notes": "Notes",
            "order-list-inventory": "Inventory",
            "order-list-actions": "Actions",
            "order-list-status-dynamic": {
                true: "done",
                false: "tbd.",
            },
            "order-details-notes-label": "Notes:",
            "notify-security-button-title": "Notify Security",
            "security-notifier-title": "Notify Security",
            "security-notifier-description":
                "Click 'Send' or press ENTER to send out the notification.",
            "security-notifier-message-box-label": "Message (optional):",
            "security-notifier-form-submit": "Send",
            "inventory-details-title": "Inventory",
            "payment-split-label-single": "Single",
            "payment-split-label-split": "Split",
            "payment-pay-button": "Pay",
            "payment-split-value-label": "Number: ",
            "payment-split-finalize-label": "Go",
            "payment-split-pay-button": "Pay",
            "item-beverage-nr-label": "Number",
            "item-beverage-name-label": "Name",
            "item-quantity-label": "Quantity",
            "item-hidden-status-label": "Visibility in Menu",
            "item-hide-visible-button-dynamic": {
                true: "Visible",
                false: "Hidden",
            },
            "vip-account-balance-button": "VIP Accounts",
            "vip-account-balances-title": "VIP Account Balances",
            "vip-account-balances-description":
                "Here you can see and change the account balances of our VIP members.",
            "user-account-search-label": "Search:",
            "search-vip-account-name-button": "Search",
            "change-vip-account-balance-amount-button": "Confirm",
            "found-users-header-username-label": "Username",
            "found-users-header-firstname-label": "First name",
            "found-users-header-lastname-label": "Last name",
            "found-users-header-email-label": "Email",
            "found-users-header-credit-current-label": "Current Credit",
            "found-users-header-credit-add-label": "Add amount",
            "edit-order-overlay-title": "Edit Order",
            "create-new-order-description":
                "Here you can add a new order (Hint: This view is not supposed to be like that).",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "head-page-title": "Flying Dutchman - VIP Dashboard",
            "page-title": "VIP Dashboard",
            "table-number-label": "Table",
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
            "head-page-title": "Flying Dutchman - Manager Dashboard",
            "page-title": "Manager Dashboard",
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
            "manage-stock-heading": "Manage Stocks",
            "revise-abounts-heading": "Revise Amount of Beverages",
            "get-price-button": "Get Price",
            "revise-price-button": "Change Price",
            "refill-beverages-label": "Order Refill of Beverages",
            "get-quantity-button": "Get Quantity",
            "add-remove-beverages-label": "Add/Remove Beverages",
            "order-refill-header-inventory-label": "Inventory",
            "order-refill-header-quantity-label": "Quantity",
            "order-refill-header-stocks-label": "Order Stocks",
            "order-refill-confirm-button": "Confirm",
            "manage-beverages-header-inventory-label": "Inventory",
            "manage-beverages-header-beverage-number-label": "Beverage number",
            "manage-beverages-header-beverage-name-label": "Name",
            "manage-beverages-header-status-label": "Status",
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
            "lang-flag-title-english": "Englisch",
            "lang-flag-title-german": "Deutsch",
            "lang-flag-title-portuguese": "Portugiesisch",
            "logged-in-user-label": "Angemeldet als:",
            "logout-button-title": "Ausloggen",
            "logo-title": "Zur Startseite",
            "home-button-title": "Zur Startseite",
        },
        // Text strings for the page 'index'
        index: {
            "head-page-title": "Flying Dutchman - Willkommen",
            "page-title": "Willkommen!",
            "link-to-login-page": "Anmelden",
            "go-to-menu-button-title": "Gehe zum Menü",
        },
        // Text strings for the page 'menu'
        menu: {
            "head-page-title": "Flying Dutchman - Menü",
            "page-title": "Menü",
            "caption": "Menü",
            "filter-icon-title-beer": "Bier",
            "filter-icon-title-wine": "Wein",
            "filter-icon-title-drink": "Drink",
            "filter-icon-title-water": "Wasser",
            "button-label-allergies": "Allergene",
            "button-label-price": "Preis",
            "button-label-tannin": "Tannin",
            "button-label-alcohol": "Alkohol %",
            "menu-item-label-origin": "Herkunft:",
            "menu-item-label-producer": "Hersteller:",

            "menu-item-label-alcoholstrength": "Alkohol:",
            "menu-item-label-packaging": "Verpackung:",
            "menu-item-label-price": "Preis:",
            "menu-item-label-year": "Jahr:",
        },
        // Text strings for the page 'login'
        login: {
            "head-page-title": "Flying Dutchman - Anmeldung",
            "caption": "Anmeldung",
            "username-label": "Benutzername",
            "password-label": "Passwort",
            "login-form-submit": "Anmelden",
            "message-wrong-credentials": "Falscher Benutzername oder Passwort!",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "head-page-title": "Flying Dutchman - Intern",
            "page-title": "Dashboard für Angestellte",
            "orders-overview-title": "Bestellungen",
            "orders-overview-table-label": "Tisch",
            "order-details-id-label": "Bestellungnummer:",
            "order-details-inventory-label": "Lager:",
            "create-order-button-text": "Neue Bestellung",
            "inventory-bar-overview-title": "Bestand Bar",
            "inventory-vip-overview-title": "Bestand Specials",
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
            "delete-order-button": "Bestellung löschen",
            "edit-order-button": "Bestellung bearbeiten",
            "order-paid-button": "Bestellung bezahlt",
            "add-more-items-button": "Mehr Artikel",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Kühlschrank",
            },
            "order-list-order-number": "Bestellung",
            "order-list-status": "Status",
            "order-list-items": "Artikel",
            "order-list-notes": "Notizen",
            "order-list-inventory": "Lager",
            "order-list-actions": "Aktionen",
            "order-list-status-dynamic": {
                true: "erledigt",
                false: "tbd.",
            },
            "order-details-notes-label": "Notizen:",
            "notify-security-button-title": "Sicherheitsdienst benachrichtigen",
            "security-notifier-title": "Sicherheitsdienst benachrichtigen",
            "security-notifier-description":
                "Klicke auf 'Senden' oder drücke ENTER zum Verschicken der Nachricht.",
            "security-notifier-message-box-label": "Nachricht (optional):",
            "security-notifier-form-submit": "Senden",
            "inventory-details-title": "Lager",
            "payment-split-label-single": "Gesamt",
            "payment-split-label-split": "Aufteilen",
            "payment-pay-button": "Bezahlen",
            "payment-split-value-label": "Anzahl: ",
            "payment-split-finalize-label": "Bestätigen",
            "payment-split-pay-button": "Bezahlen",
            "item-beverage-nr-label": "Nummer",
            "item-beverage-name-label": "Name",
            "item-quantity-label": "Anzahl",
            "item-hidden-status-label": "Sichtbarkeit",
            "item-hide-visible-button-dynamic": {
                true: "Sichtbar",
                false: "Versteckt",
            },
            "vip-account-balance-button": "VIP Konten",
            "vip-account-balances-title": "VIP Kontostände",
            "vip-account-balances-description":
                "Hier kannst du die Kontostände unserer VIP Mitglieder sehen und anpassen.",
            "user-account-search-label": "Suche:",
            "search-vip-account-name-button": "Suchen",
            "change-vip-account-balance-amount-button": "Bestätigen",
            "found-users-header-username-label": "Benutzername",
            "found-users-header-firstname-label": "Vorname",
            "found-users-header-lastname-label": "Nachname",
            "found-users-header-email-label": "E-Mail-Adresse",
            "found-users-header-credit-current-label": "Aktueller Kontostand",
            "found-users-header-credit-add-label": "Betrag hinzufügen",
            "edit-order-overlay-title": "Bestellung bearbeiten",
            "create-new-order-description":
                "Hier kannst du eine neue Bestellung anlegen",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "head-page-title": "Flying Dutchman - VIP Dashboard",
            "page-title": "VIP Dashboard",
            "table-number-label": "Tisch",
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
            "head-page-title": "Flying Dutchman - Manager Dashboard",
            "page-title": "Manager Dashboard",
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
            "manage-stock-heading": "Lagerverwaltung",
            "revise-abounts-heading": "Verwaltung der Preise",
            "get-price-button": "Zeige aktueller Preis",
            "revise-price-button": "Preis anpassen",
            "refill-beverages-label": "Nachschub bestellen",
            "get-quantity-button": "Zeige Bestand",
            "add-remove-beverages-label": "Artikel hinzufügen/entfernen",
            "order-refill-header-inventory-label": "Lager",
            "order-refill-header-quantity-label": "Anzahl",
            "order-refill-header-stocks-label": "Nachschub Bestellen",
            "order-refill-confirm-button": "Bestätigen",
            "manage-beverages-header-inventory-label": "Lager",
            "manage-beverages-header-beverage-number-label": "Artikelnummer",
            "manage-beverages-header-beverage-name-label": "Name",
            "manage-beverages-header-status-label": "Status",
        },
        // Text strings for the SpecRunner (unit tests)
        SpecRunner: {
            "unit-test": "german",
        },
    },
    // Portuguese
    pt: {
        // Common text strings (relevant for multiple pages)
        _: {
            "lang-flag-title-english": "Inglês",
            "lang-flag-title-german": "Alemão",
            "lang-flag-title-portuguese": "Português",
            "logged-in-user-label": "Entrar:",
            "logout-button-title": "Sair",
            "logo-title": "Início",
            "home-button-title": "Inîcio",
        },
        // Text strings for the page 'index'
        index: {
            "head-page-title": "Flying Dutchman - Bem-vindo",
            "page-title": "Bem-vindo!",
            "link-to-login-page": "Entrar",
            "go-to-menu-button-title": "Cardâpio",
        },
        // Text strings for the page 'menu'
        menu: {
            "head-page-title": "Flying Dutchman - Cardápio",
            "page-title": "Cardápio",
            "caption": "Cardápio",
            "filter-icon-title-beer": "Cerveja",
            "filter-icon-title-wine": "Vinhos",
            "filter-icon-title-drink": "Bebidas",
            "filter-icon-title-water": "Garçon",
            "button-label-allergies": "Alergias",
            "button-label-price": "Preço",
            "button-label-tannin": "Tanino",
            "button-label-alcohol": "Rôtulo",
            "menu-item-label-origin": "Região de Origem:",
            "menu-item-label-producer": "Produtor:",
            "menu-item-label-alcoholstrength": "Teor de Alcool:",
            "menu-item-label-packaging": "Pacote:",
            "menu-item-label-price": "Preço:",
            "menu-item-label-year": "Ano:",
        },
        // Text strings for the page 'login'
        login: {
            "head-page-title": "Flying Dutchman - Entrar",
            "caption": "Entrar",
            "username-label": "Usuário",
            "password-label": "Senha",
            "login-form-submit": "Entrar",
            "message-wrong-credentials": "Nome ou senha incorreta!",
        },
        // Text strings for the page 'staff dashboard'
        staff_dashboard: {
            "head-page-title":
                "Flying Dutchman - Painel de Controle dos Funcionários",
            "page-title":
                "Flying Dutchman - Painel de Controle dos Funcionários",
            "orders-overview-title": "Pedidos",
            "orders-overview-table-label": "Mesa",
            "order-details-id-label": "Pedido Número:",
            "order-details-inventory-label": "Inventário:",
            "create-order-button-text": "Ordenar",
            "inventory-bar-overview-title": "Inventário Bar",
            "inventory-vip-overview-title": "Inventário Especiais",
            "orders-list-total-number-label": "Número de Pedidos:",
            "inventory-notifications-total-number-label":
                "Itens com pouca quantidade:",
            "order-details-heading-with-table-number": "Pedidos para a Mesa",
            "create-order-items-label": "Itens:",
            "order-details-items-label": "Itens:",
            "inventory-details-label": "Inventário:",
            "inventory-details-items-running-low-label":
                "Itens com pouca quantidade:",
            "create-order-title": "Ordenar",
            "create-order-table-label": "Mesa:",
            "create-order-add-item-label": "Item:",
            "create-order-notes-label": "Observações:",
            "create-order-inventory-label": "Inventário:",
            "create-order-inventory-label-bar": "Bar",
            "create-order-inventory-label-vip": "VIP",
            "create-order-form-submit": "Ordenar",
            "delete-order-button": "Cancelar Pedido",
            "edit-order-button": "Abrir Pedido",
            "order-paid-button": "Order paid", // TODO: Translate into portuguese
            "add-more-items-button": "Adicionar mais itens",
            "order-inventory-dynamic": {
                [Constants.INVENTORIES.BAR]: "Bar",
                [Constants.INVENTORIES.VIP]: "VIP Cooler",
            },
            "order-list-order-number": "Ordenar",
            "order-list-status": "Status",
            "order-list-items": "Itens",
            "order-list-notes": "Informações",
            "order-list-inventory": "Inventário",
            "order-list-actions": "Editar ações",
            "order-list-status-dynamic": {
                true: "Pedido Completo",
                false: "tbd.",
            },
            "order-details-notes-label": "Informações:",
            "notify-security-button-title": "Chamar Segurança",
            "security-notifier-title": "Chamar Segurança",
            "security-notifier-description":
                "Clique em 'Envie' ou clique em ENTRA para enviar notificação.",
            "security-notifier-message-box-label": "Mensagem (opcional):",
            "security-notifier-form-submit": "Envie",
            "inventory-details-title": "Inventôrio",
            "payment-split-label-single": "único",
            "payment-split-label-split": "Dividir",
            "payment-pay-button": "Pagar",
            "payment-split-value-label": "Dividir Valor: ",
            "payment-split-finalize-label": "Ir",
            "payment-split-pay-button": "Pagar",
            "item-beverage-nr-label": "Número",
            "item-beverage-name-label": "Nonme",
            "item-quantity-label": "Quantidade",
            "item-hidden-status-label": "Disponível no Cardápio",
            "item-hide-visible-button-dynamic": {
                true: "Visible", // TODO: Translate into portuguese
                false: "Hidden", // TODO: Translate into portuguese
            },
            "vip-account-balance-button": "VIP Contas",
            "vip-account-balances-title": "VIP Saldo de Contas",
            "vip-account-balances-description":
                "Aqui pode se mudar o saldo da conta do usuario.",
            "user-account-search-label": "Busca",
            "search-vip-account-name-button": "Busca",
            "change-vip-account-balance-amount-button": "Confirmar",
            "found-users-header-username-label": "Usuário",
            "found-users-header-firstname-label": "Nome",
            "found-users-header-lastname-label": "Sobrenome",
            "found-users-header-email-label": "Email",
            "found-users-header-credit-current-label": "Saldo",
            "found-users-header-credit-add-label": "Adicionar Valor",
            "edit-order-overlay-title": "Edit Order", // TODO: Translate into portuguese
            "create-new-order-description": "Here you can add a new order",
        },
        // Text strings for the page 'vip dashboard'
        vip_dashboard: {
            "head-page-title": "Flying Dutchman - VIP Painel de Controle",
            "page-title": "VIP Painel de Controle",
            "table-number-label": "Mesa Número",
            "vip-welcome-text": "Bem-vindo",
            "vip-account-balance-text": "Saldo =",
            "place-order-button": "Ordenar",
            "menu-heading": "Cardápio",
            "specials-heading": "Especiais",
            "waiter-call-button": "Chamar o Garçon",
            "pay-bill-button": "Pagar a Conta",
            "info-box-title": "Informação",
        },
        // Text strings for the page 'manager dashboard'
        manager_dashboard: {
            "head-page-title":
                "Flying Dutchman - Painel de Controle da Gerência",
            "page-title": "Gerência - Painel de Contrôle",
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
            "manage-stock-heading": "Gerencie Inventôrio",
            "revise-abounts-heading": "Checar Estoque de Bebidas",
            "get-price-button": "Ver Preço",
            "revise-price-button": "Mudar o Preço",
            "refill-beverages-label": "Repôr Bebidas",
            "get-quantity-button": "Qual a quantidade?",
            "add-remove-beverages-label": "Adicione/Remova Bebidas",
            "order-refill-header-inventory-label": "Inventôrio",
            "order-refill-header-quantity-label": "Quantidade",
            "order-refill-header-stocks-label": "Atualização de Estoque",
            "order-refill-confirm-button": "Confirmar",
            "manage-beverages-header-inventory-label": "Inventório",
            "manage-beverages-header-beverage-number-label": "Bebida Código",
            "manage-beverages-header-beverage-name-label": "Nome",
            "manage-beverages-header-status-label": "Status",
        },
        SpecRunner: {
            "unit-test": "português",
        },
    },
};
