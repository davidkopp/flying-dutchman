/*
 * File: MenuController.js
 *
 * Controller that is responsible for displaying and updating the menu for customers.
 *
 * Author: David Kopp
 * -----
 * Last Modified: Tuesday, 8th March 2022
 * Modified By: David Kopp (mail@davidkopp.de>)
 */

(function ($, exports) {
    const inventoryName = Constants.INVENTORIES.BAR;
    let lastUsedFilter;

    $(document).ready(function () {
        // Add hover effect and focus change to the filter icons.
        $(".filter-icon > img").click(function () {
            $(".filter-icon > img").each(function () {
                $(this).attr("src", $(this).data("src"));
            });
            $(this).attr("src", $(this).data("hover"));
        });

        initMenu();
    });

    /**
     * Filter the beverages according to the type and show them in the menu.
     *
     * @param {string} byType The name of the filter type.
     */
    function filterMenu(byType) {
        switch (byType) {
            case Constants.BEER_filter:
            case Constants.WINE_filter:
            case Constants.DRINK_filter:
            case Constants.WATER_filter:
                initMenu(byType);
                break;
            default:
                console.log(
                    `MenuController | Beverage type '${byType}' is unknown.`
                );
                break;
        }
    }

    /**
     * Initialize the menu with the information about the available beverages.
     * With the optional filter argument it's possible to only show one specific type.
     *
     * @param {string} filterByType The optional filter.
     */
    function initMenu(filterByType) {
        console.log(
            "MenuController | Start initializing the menu " +
                (filterByType
                    ? "with a filter: " + filterByType
                    : "without a filter.")
        );

        // At first remove the currently shown menu.
        $("#menu-container").empty();

        lastUsedFilter = filterByType;

        // TODO: Differentiate between bar and vip inventory
        const inventoryItems =
            DatabaseAPI.Inventory.getInventory(inventoryName);
        const hideFromMenuList = DatabaseAPI.HideFromMenu.getList();
        for (let i = 0; i < inventoryItems.length; i++) {
            const inventoryItem = inventoryItems[i];
            const beverageNr = inventoryItem.beverageNr;

            // Check if the beverage number is marked as "hide from menu". If so, skip it.
            if (hideFromMenuList.includes(beverageNr)) {
                console.log(
                    `MenuController.initMenu | The inventory item with the beverage number '${beverageNr}' is included in the "hideFromMenu" list. Don't show it in the menu.`
                );
                continue;
            }
            // Check if the inventory item is set to `active`. If not, skip it.
            if (inventoryItem.active === false) {
                console.log(
                    `MenuController.initMenu | The inventory item with the beverage number '${beverageNr}' has the "active" property set to '${inventoryItem.active}'. Don't show it in the menu.`
                );
                continue;
            }

            // Check if we have enough beverages left in the inventory. If not, skip it.
            const quantity = inventoryItem.quantity;
            if (!quantity || quantity < 1) {
                console.log(
                    `MenuController.initMenu | The item in the inventory '${inventoryName}' with the beverage number '${beverageNr}' doesn't have enough quanities left in the inventory (${quantity}). Don't show it in the menu.`
                );
                continue;
            }

            const beverage = DatabaseAPI.Beverages.findBeverageByNr(beverageNr);
            // Check if the beverage exists in the beverage db.
            if (!beverage) {
                console.log(
                    `MenuController.initMenu | The inventory '${inventoryName}' includes a beverage with the number '${beverageNr}' that is unknown!`
                );
                continue;
            }

            displayBeverageInMenu(beverage, quantity, filterByType);
        }
    }

    /**
     * Displays the information about a beverage in the menu.
     *
     * @param {object} beverage The beverage item.
     * @param {number} quantity Number of available beverages left.
     * @param {string} filterByType The optional type filter.
     */
    function displayBeverageInMenu(beverage, quantity, filterByType) {
        if (!beverage) {
            return;
        }

        let optHtmlClassLowInStock;
        if (quantity < Constants.LOW_STOCK_NUMBER) {
            optHtmlClassLowInStock = "menu-item-is-low-in-stock";
        }

        var menuItemHTML = "";

        // Check type and displays the relevant information depending on the type.
        // If a filter is defined, use the filter and check if the type matches the filter.
        const type = beverage.category.toUpperCase();
        if (
            containsAnyOf(type, Constants.BEER_CATEGORY) &&
            (!filterByType || filterByType === Constants.BEER_filter)
        ) {
            // Beer or cider
            menuItemHTML = `<div class="item  ${optHtmlClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.producer}</li>
                    <li>${beverage.countryoforiginlandname}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.alcoholstrength}</li>
                    <li>${beverage.packaging}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="assets/images/placeholder_beer.png"
                    alt="">
            </div>`;
        } else if (
            containsAnyOf(type, Constants.WINE_CATEGORY) &&
            (!filterByType || filterByType === Constants.WINE_filter)
        ) {
            // Wine
            menuItemHTML = `<div class="item  ${optHtmlClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${
                        beverage.nr
                    }</li>
                    <li>${beverage.name}</li>
                    <li>${extractYearOutOfDate(beverage.introduced)}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.packaging}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="assets/images/placeholder_wine.png"
                    alt="">
            </div>`;
        } else if (
            containsAnyOf(type, Constants.DRINKS_CATEGORY) &&
            (!filterByType || filterByType === Constants.DRINK_filter)
        ) {
            // Cocktails / Drinks / Mixed drinks
            menuItemHTML = `<div class="item  ${optHtmlClassLowInStock}">
                    <ul>
                        <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                        <li>${beverage.name}</li>
                        <li>${beverage.category}</li>
                        <li>${beverage.alcoholstrength}</li>
                        <li>${beverage.packaging}</li>
                        <li>${beverage.priceinclvat}</li>
                    </ul>
                    <img src="assets/images/placeholder_drink.png"
                        alt="">
                </div>`;
        } else if (
            containsAnyOf(type, Constants.WATER_CATEGORY) &&
            (!filterByType || filterByType === Constants.WATER_filter)
        ) {
            // Water
            menuItemHTML = `<div class="item  ${optHtmlClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="assets/images/placeholder_water.png"
                    alt="">
            </div>`;
        } else if (!filterByType) {
            // Unknown type and no filter is set → Show some basic information of the beverage
            menuItemHTML = `<div class="item  ${optHtmlClassLowInStock}">
                <ul>
                    <li class="menu-item-property menu-item-id hidden">${beverage.nr}</li>
                    <li>${beverage.name}</li>
                    <li>${beverage.category}</li>
                    <li>${beverage.alcoholstrength}</li>
                    <li>${beverage.priceinclvat}</li>
                </ul>
                <img src="assets/images/placeholder_others.png"
                    alt="">
            </div>`;
        }

        $("#menu-container").append(menuItemHTML);
    }

    /**
     * Refreshes the menu in the view by reinitializes it. It uses the same
     * filter as before (could be `undefined`).
     */
    function refreshMenu() {
        initMenu(lastUsedFilter);
    }

    /**
     * Removes a beverage from the list "hideFromMenu" and refreshes the menu in the view.
     *
     * @param {string} beverageNr The beverage number.
     */
    function showBeverageInMenu(beverageNr) {
        DatabaseAPI.HideFromMenu.removeBeverageNrFromList(beverageNr);
        refreshMenu();
    }

    /**
     * Adds a beverage to the list "hideFromMenu" and refreshes the menu in the view.
     *
     * @param {string} beverageNr The beverage number.
     */
    function hideBeverageFromMenu(beverageNr) {
        DatabaseAPI.HideFromMenu.addBeverageNrToList(beverageNr);
        refreshMenu();
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
    exports.MenuController.showBeverageInMenu = showBeverageInMenu;
    exports.MenuController.hideBeverageFromMenu = hideBeverageFromMenu;
})(jQuery, window);
