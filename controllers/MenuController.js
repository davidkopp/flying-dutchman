/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Sunday, 20th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */
/* globals LanguageController, EffectsController */

(function ($, exports) {
    /**
     * The variable `lastUsedFilter` stores the current used filter to be able
     * to reset the filter and changing the icon of the filters.
     */
    let lastUsedFilter;

    $(document).ready(function () {
        initDefaultMenu();
    });

    /**
     * Filter the beverages according to the type and show them in the menu.
     *
     * @param {string} byType The name of the filter type.
     */
    function filterMenu(byType) {
        if (byType === lastUsedFilter) {
            // Reset the filter
            initDefaultMenu();
        } else {
            switch (byType) {
                case Constants.BEER_filter:
                case Constants.WINE_filter:
                case Constants.DRINK_filter:
                case Constants.WATER_filter:
                    initDefaultMenu(byType);
                    break;
                default:
                    console.log(
                        `MenuController | Beverage type '${byType}' is unknown.`
                    );
                    break;
            }
        }
    }

    /**
     * Initializes the menu with the default config for normal customers.
     *
     * @param {string} filterByType The optional filter.
     */
    function initDefaultMenu(filterByType) {
        const menuConfig = {
            viewElementId: "menu-container",
            inventory: Constants.INVENTORIES.BAR,
        };
        initMenu(menuConfig, filterByType);
    }

    /**
     * Initialize the menu with the information about the available beverages.
     * The config object is used to know which inventory should be used and
     * where in the view the menu items should be placed. With the optional
     * filter argument it's possible to only show one specific type.
     *
     * @param {object} config The config object for the initialization.
     * @param {string} filterByType The optional filter.
     */
    function initMenu(config, filterByType) {
        if (!config || !config.viewElementId || !config.inventory) {
            console.log(
                "MenuController | Invalid config for initializing the menu! Required properties are `viewElementId` and `inventory`."
            );
        }
        console.log(
            `MenuController | Start initializing the menu with items from the '${config.inventory}' ` +
                (filterByType
                    ? `with the filter '${filterByType}'.`
                    : `without a filter.`) +
                " Config: " +
                JSON.stringify(config)
        );

        const $viewMenuContainer = $(`#${config.viewElementId}`);
        if ($viewMenuContainer.length == 0) {
            console.log(
                `MenuController | View element with id '${config.viewElementId}' does not exist! Can't initialize menu.`
            );
            return;
        }

        // At first remove the currently shown menu.
        $viewMenuContainer.empty();

        lastUsedFilter = filterByType;

        const inventoryItems = DatabaseAPI.Inventory.getInventory(
            config.inventory
        );
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            const beverageNr = inventoryItem.beverageNr;

            // Check if the inventory item is marked as "visible in menu". If not, skip it.
            if (inventoryItem.visibleInMenu !== true) {
                continue;
            }
            // Check if the inventory item is set to `active`. If not, skip it.
            if (inventoryItem.active === false) {
                continue;
            }

            // Check if we have enough beverages left in the inventory. If not, skip it.
            const quantity = inventoryItem.quantity;
            if (!quantity || quantity < 1) {
                console.log(
                    `MenuController.initMenu | The item in the inventory '${config.inventory}' with the beverage number '${beverageNr}' doesn't have enough quantities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            const beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Check if the beverage exists in the beverage db.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory '${config.inventory}' includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            const beverageInfoHtml = getHtmlForMenuItem(
                beverage,
                filterByType,
                config.allowDragItems
            );
            $viewMenuContainer.append(beverageInfoHtml);
        }

        EffectsController.updateFilterIconsInView(lastUsedFilter);

        // Refresh all text strings
        LanguageController.refreshTextStrings();
    }

    /**
     * Creates the html string to display the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     * @param {string} filterByType The optional type filter.
     * @param {boolean} allowDragItems The optional boolean value for allowing
     *   dragging of the items.
     * @returns {string} The html to display the menu item.
     */
    function getHtmlForMenuItem(beverage, filterByType, allowDragItems) {
        if (!beverage) {
            return;
        }

        // Check type and displays the relevant information depending on the type.
        // If a filter is defined, use the filter and check if the type matches the filter.
        const type = beverage.category.toUpperCase();
        let relevantInfoToDisplay;
        let imageSource = "";
        if (
            containsAnyOf(type, Constants.BEER_CATEGORY) &&
            (!filterByType || filterByType === Constants.BEER_filter)
        ) {
            // Beer or cider
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-category",
                },
                producer: {
                    value: beverage.producer,
                    dataLangKeyForLabel: "menu-item-label-producer",
                    classToAdd: "",
                },
                country: {
                    value: beverage.countryoforiginlandname,
                    dataLangKeyForLabel: "menu-item-label-origin",
                    classToAdd: "",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_beer.png";
        } else if (
            containsAnyOf(type, Constants.WINE_CATEGORY) &&
            (!filterByType || filterByType === Constants.WINE_filter)
        ) {
            // Wine
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-category",
                },
                year: {
                    value: extractYearOutOfDate(beverage.introduced),
                    dataLangKeyForLabel: "menu-item-label-year",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_wine.png";
        } else if (
            containsAnyOf(type, Constants.DRINKS_CATEGORY) &&
            (!filterByType || filterByType === Constants.DRINK_filter)
        ) {
            // Cocktails / Drinks / Mixed drinks
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-category",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                packaging: {
                    value: beverage.packaging,
                    dataLangKeyForLabel: "menu-item-label-packaging",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_drink.png";
        } else if (
            containsAnyOf(type, Constants.WATER_CATEGORY) &&
            (!filterByType || filterByType === Constants.WATER_filter)
        ) {
            // Water
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-category",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_water.png";
        } else if (!filterByType) {
            // Unknown type and no filter is set → Show some basic information of the beverage
            relevantInfoToDisplay = {
                name: {
                    value: beverage.name,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-title",
                },
                category: {
                    value: beverage.category,
                    dataLangKeyForLabel: "",
                    classToAdd: "menu-item-category",
                },
                alcoholstrength: {
                    value: beverage.alcoholstrength,
                    dataLangKeyForLabel: "menu-item-label-alcoholstrength",
                    classToAdd: "",
                },
                price: {
                    value: beverage.priceinclvat,
                    dataLangKeyForLabel: "menu-item-label-price",
                    classToAdd: "menu-item-info-with-margin",
                    suffix: "SEK",
                },
            };
            imageSource = "assets/images/placeholder_others.png";
        }

        // E.g. when a filter is set, there is nothing to display → do nothing.
        if (!relevantInfoToDisplay) {
            return;
        }

        // Finally create the html for the menu item.
        let menuItemInfoHTML = "";
        for (const key in relevantInfoToDisplay) {
            if (Object.hasOwnProperty.call(relevantInfoToDisplay, key)) {
                const infoObject = relevantInfoToDisplay[key];
                const optDataLangHtml = infoObject.dataLangKeyForLabel
                    ? `data-lang="${infoObject.dataLangKeyForLabel}"`
                    : "";

                menuItemInfoHTML += `
                <div class="menu-item-info ${infoObject.classToAdd}">
                    <span class="menu-item-info-label" ${optDataLangHtml}></span>
                    <span>${infoObject.value} ${
                    infoObject.suffix ? infoObject.suffix : ""
                }</span>
                </div>
                `;
            }
        }

        let menuItemHTML = "";
        if (!allowDragItems) {
            menuItemHTML = `
            <div
                id="item-${beverage.nr}"
                data-beverage-nr="${beverage.nr}"
                class="item">
                <div>
                    ${menuItemInfoHTML}
                </div>
                <img src="${imageSource}" alt="">
            </div>
            `;
        } else {
            // Add info to the menu item so it will be draggable
            menuItemHTML = `
            <div
                id="item-${beverage.nr}"
                data-beverage-nr="${beverage.nr}"
                class="item drag-items"
                draggable=true
                ondragstart="dragItem(event)">
                <div>
                    ${menuItemInfoHTML}
                </div>
                <img src="${imageSource}" alt="">
            </div>
            `;
        }
        return menuItemHTML;
    }

    /**
     * Refreshes the menu in the view by reinitializes it. It uses the same
     * filter as before (could be `undefined`).
     */
    function refreshMenu() {
        initDefaultMenu(lastUsedFilter);
    }

    /**
     * Checks if a text includes substrings given by an array.
     *
     * @param {string} text The text to check
     * @param {string} array The array with multiple substrings
     * @returns {boolean} `true` if the text includes at least one of the
     *   substrings inside the array
     */
    function containsAnyOf(text, array) {
        return array.some((substring) => text.includes(substring));
    }

    /**
     * Extracts the year out of the date.
     *
     * @param {string} dateString The date as a string.
     * @returns {string} The year.
     */
    function extractYearOutOfDate(dateString) {
        return new Date(dateString).getFullYear();
    }

    exports.MenuController = {};
    exports.MenuController.filterMenu = filterMenu;
    exports.MenuController.initMenu = initMenu;
})(jQuery, window);
